import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/database/entities/user.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllCustomers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserByIdOrEmailOrPhone(id?: string, email?: string, phone?: string): Promise<User | null> {
    if (id) {
      return this.userRepository.findOne({
        where: { user_id: parseInt(id) }
      });
    }

    if (email) {
      return this.userRepository.findOne({
        where: { email }
      });
    }

    if (phone) {
      return this.userRepository.findOne({
        where: { phone }
      });
    }

    return null;
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
    const result = await this.userRepository.update(
      { user_id: parseInt(userId) },
      updateData
    );

    if (result.affected === 0) {
      return null;
    }

    return this.userRepository.findOne({
      where: { user_id: parseInt(userId) }
    });
  }
}
