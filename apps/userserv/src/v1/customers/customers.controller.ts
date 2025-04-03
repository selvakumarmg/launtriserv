import { Controller, Get, Query, Put, Body, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { User } from '../../database/entities/user.entity';
import { 
  NotFoundException, 
  InternalServerErrorException,
  BadRequestException 
} from '@app/common/errors';

export class GetOTPRequestDto {
  email: string;
  phone: string;
}

export class VerifyOTPRequestDto {
  userId: number;
  otp: string;
}

export class ApiResponseDto<T> {
  statusCode: number;
  message: string;
  data?: T;
}

@ApiTags('Customers')
@Controller('v1/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Returns all customers' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllCustomers(): Promise<ApiResponseDto<User[]>> {
    try {
      const customers = await this.customersService.getAllCustomers();
      return {
        statusCode: 200,
        message: 'Customers fetched successfully',
        data: customers,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Get user by ID, email, or phone' })
  @ApiQuery({ name: 'id', required: false, description: 'User ID' })
  @ApiQuery({ name: 'email', required: false, description: 'User email' })
  @ApiQuery({ name: 'phone', required: false, description: 'User phone number' })
  @ApiResponse({ status: 200, description: 'Returns user details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserByIdOrEmailOrPhone(
    @Query('id') id?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ): Promise<ApiResponseDto<User>> {
    try {
      if (!id && !email && !phone) {
        throw new BadRequestException('At least one search parameter (id, email, or phone) is required');
      }

      const user = await this.customersService.getUserByIdOrEmailOrPhone(id, email, phone);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        statusCode: 200,
        message: 'User details fetched successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer details' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<ApiResponseDto<User>> {
    try {
      if (!id) {
        throw new BadRequestException('Customer ID is required');
      }

      const updatedUser = await this.customersService.updateUser(id, updateData);
      
      if (!updatedUser) {
        throw new NotFoundException('Customer not found');
      }

      return {
        statusCode: 200,
        message: 'Customer updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('get-otp-customers')
  @ApiOperation({ summary: 'Generate OTP for user verification' })
  @ApiBody({ type: GetOTPRequestDto, required: true })
  @ApiResponse({ status: 200, description: 'OTP generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or mismatched data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getOTP(
    @Body() body: GetOTPRequestDto,
  ): Promise<ApiResponseDto<{ otp: string; userId: number }>> {
    try {
      if (!body.email || !body.phone) {
        throw new BadRequestException('Email and phone number are required');
      }

      const result = await this.customersService.generateOTP(body.email, body.phone);
      console.log("customer result", result);
      return {
        statusCode: 200,
        message: 'OTP generated successfully',
        data: { 
          otp: result.otp,
          userId: result.userId
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('verify-otp-customers')
  @ApiOperation({ summary: 'Verify OTP for user verification' })
  @ApiBody({ type: VerifyOTPRequestDto, required: true })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or mismatched data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async verifyOTP(
    @Body() body: VerifyOTPRequestDto,
  ): Promise<ApiResponseDto<{ verified: boolean }>> {
    try {
      console.log('Verifying OTP for user:', body.userId);
      console.log('Provided OTP:', body.otp);

      if (!body.userId || !body.otp) {
        throw new BadRequestException('User ID and OTP are required');
      }

      const result = await this.customersService.verifyOTP(body.userId, body.otp);
      console.log('Verification result:', result);
      
      if (!result) {
        throw new BadRequestException('Invalid OTP or OTP has expired');
      }

      return {
        statusCode: 200,
        message: 'OTP verified successfully',
        data: { verified: true },
      };
    } catch (error) {
      console.error('Error in verifyOTP controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
