import { Module } from '@nestjs/common';
import { UserservController } from './userserv.controller';
import { UserservService } from './userserv.service';
import { DatabaseModule } from '@app/database/database.module';
import { CustomersModule } from './v1/customers/customers.module';

@Module({
  imports: [
    DatabaseModule,
    CustomersModule
  ],
  controllers: [UserservController],
  providers: [UserservService],
})
export class UserservModule {}
