import { Injectable } from '@nestjs/common';
import { Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../../database/entities/user.entity';
import { InternalServerErrorException, BadRequestException } from '@app/common/errors';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllCustomers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch customers');
    }
  }

  async getUserByIdOrEmailOrPhone(id?: string, email?: string, phone?: string): Promise<User | null> {
    try {
      console.log('Searching user with:', { id, email, phone });
      
      const selectFields = {
        user_id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        account_status: true,
        profile_status: true,
        created_at: true,
        updated_at: true
      } as const;
      
      if (id) {
        console.log('INSIDE ID VALUE', { id});
        const user = await this.userRepository.findOne({
          where: { user_id: parseInt(id) },
          select: selectFields
        });
        console.log('Found user by ID:', user);
        return user;
      }

      if (email) {
        const user = await this.userRepository.findOne({
          where: { email },
          select: selectFields
        });
        console.log('Found user by email:', user);
        return user;
      }

      if (phone) {
        const user = await this.userRepository.findOne({
          where: { phone },
          select: selectFields
        });
        console.log('Found user by phone:', user);
        return user;
      }

      console.log('No search parameters provided');
      return null;
    } catch (error) {
      console.error('Error in getUserByIdOrEmailOrPhone:', error);
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Failed to fetch user details: ${error.message}`);
      }
      throw new InternalServerErrorException('Failed to fetch user details');
    }
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
    try {
      const result = await this.userRepository.update(
        { user_id: parseInt(userId) },
        updateData
      );

      if (result.affected === 0) {
        return null;
      }

      return await this.userRepository.findOne({
        where: { user_id: parseInt(userId) }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user details');
    }
  }

  async generateOTP(email: string, phoneNum: string): Promise<{ otp: string; userId: number }> {
    try {
      console.log('Starting OTP generation for:', { email, phoneNum });
      
      // Validate input
      if (!email || !phoneNum) {
        console.error('Missing required fields:', { email, phoneNum });
        throw new BadRequestException('Email and phone number are required');
      }

      // Find user by email
      console.log('Searching user by email:', email);
      const userByEmail = await this.userRepository.findOne({
        where: { email },
        select: [
          'user_id',
          'name',
          'email',
          'phone',
          'role',
          'account_status',
          'profile_status',
          'otp',
          'otp_expires_at',
          'is_otp_verified'
        ]
      });

      // Find user by phone number
      console.log('Searching user by phone:', phoneNum);
      const userByPhone = await this.userRepository.findOne({
        where: { phone: phoneNum },
        select: [
          'user_id',
          'name',
          'email',
          'phone',
          'role',
          'account_status',
          'profile_status',
          'otp',
          'otp_expires_at',
          'is_otp_verified'
        ]
      });

      console.log('User by email:', userByEmail);
      console.log('User by phone:', userByPhone);

      // If either email or phone exists but they don't match the same account
      if ((userByEmail && !userByPhone) || (!userByEmail && userByPhone) || 
          (userByEmail && userByPhone && userByEmail.user_id !== userByPhone.user_id)) {
        console.error('Mismatched user accounts found');
        throw new BadRequestException('Mismatched user');
      }

      let user: User;
      // If both exist and match the same account
      if (userByEmail && userByPhone && userByEmail.user_id === userByPhone.user_id) {
        console.log('Existing user found:', userByEmail.user_id);
        user = userByEmail;
      } else {
        // If neither exists, create new user
        console.log('Creating new user');
        try {
          user = this.userRepository.create({
            email,
            phone: phoneNum,
            name: email.split('@')[0], // Use part of email as default name
            role: UserRole.CUSTOMER,
            account_status: 'pending',
            profile_status: 'active'
          });
          console.log('New user object created:', user);
          user = await this.userRepository.save(user);
          console.log('New user saved successfully:', user.user_id);
        } catch (error) {
          console.error('Error creating new user:', error);
          // Handle unique constraint violation
          if (error.code === '23505') { // PostgreSQL unique violation code
            throw new BadRequestException('Email or phone number already exists');
          }
          throw new InternalServerErrorException(`Failed to create user: ${error.message}`);
        }
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated OTP:', otp);
      
      // Update user with OTP
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
      
      user.otp = otp;
      user.otp_expires_at = expiresAt;
      user.is_otp_verified = false;
      
      console.log('Updating user with OTP:', {
        userId: user.user_id,
        otp,
        expiresAt
      });

      try {
        const savedUser = await this.userRepository.save(user);
        console.log('User updated successfully with OTP:', savedUser.user_id);
        return { otp, userId: user.user_id };
      } catch (error) {
        console.error('Error saving OTP to user:', error);
        throw new InternalServerErrorException(`Failed to save OTP: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in generateOTP:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to generate OTP: ${error.message}`);
    }
  }

  async verifyOTP(userId: number, otp: string): Promise<boolean> {
    try {
      console.log('Starting OTP verification for user:', userId);
      
      // Find user by ID with explicit field selection
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
        select: [
          'user_id',
          'name',
          'email',
          'phone',
          'role',
          'account_status',
          'profile_status',
          'otp',
          'otp_expires_at',
          'is_otp_verified',
          'created_at',
          'updated_at'
        ]
      });

      console.log('Found user:', user);
      console.log('Provided OTP:', otp);
      console.log('Stored OTP:', user?.otp);
      console.log('OTP expires at:', user?.otp_expires_at);
      console.log('Current time:', new Date());

      if (!user) {
        console.log('User not found');
        return false;
      }

      // Check if OTP exists and hasn't expired
      if (!user.otp || !user.otp_expires_at || user.otp_expires_at < new Date()) {
        console.log('OTP expired or not found');
        console.log('OTP exists:', !!user.otp);
        console.log('Expiration exists:', !!user.otp_expires_at);
        if (user.otp_expires_at) {
          console.log('Time until expiration:', user.otp_expires_at.getTime() - new Date().getTime());
        }
        return false;
      }

      // Check if OTP matches
      if (user.otp !== otp) {
        console.log('OTP mismatch');
        console.log('Expected:', user.otp);
        console.log('Received:', otp);
        return false;
      }

      // Mark OTP as verified and update user status
      user.is_otp_verified = true;
      user.account_status = 'verified';
      user.otp = null; // Clear the OTP after verification
      user.otp_expires_at = null; // Clear the expiration time
      
      await this.userRepository.save(user);
      console.log('OTP verified successfully');

      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new InternalServerErrorException('Failed to verify OTP');
    }
  }
}
