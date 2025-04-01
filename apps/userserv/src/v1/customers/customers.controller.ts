import { Controller, Get, Query, HttpException, HttpStatus, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { User } from '@app/database/entities/user.entity';

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
  async getAllCustomers(): Promise<User[]> {
    try {
      return await this.customersService.getAllCustomers();
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal server error',
          error: error.name,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      const user = await this.customersService.getUserByIdOrEmailOrPhone(id, email, phone);
      
      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const res = {
        statusCode: HttpStatus.OK,
        message: 'User details fetched successfully',
        data: user,
      };

      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal server error',
          error: error.name,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      const updatedUser = await this.customersService.updateUser(id, updateData);
    console.log('Updating user with ID:', id, 'with data:', updateData);
      
      if (!updatedUser) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Customer not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Customer updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal server error',
          error: error.name,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
