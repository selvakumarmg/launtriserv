import { Module, Global, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database.config';
import { User } from './entities/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TypeOrmModule.forFeature([User])
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      const environment = process.env.NODE_ENV || 'local';
      console.log('\x1b[32m%s\x1b[0m', `✅ Database connection established successfully (${environment} environment)`);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', '❌ Database connection failed:', error.message);
      throw error;
    }
  }
}
