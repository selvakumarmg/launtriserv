import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { OTP } from '../../database/entities/otp.entity';
import { User } from '@app/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OTP])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {} 