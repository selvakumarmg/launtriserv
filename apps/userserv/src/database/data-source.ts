import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { config } from 'dotenv';
import { join } from 'path';

config(); // Load environment variables from .env file

const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_DATABASE || 'launtri_db',
  synchronize: false, // Set to false in production
  logging: true,
  entities: [User],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  subscribers: [],
};

console.log('Connecting to database:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username
});

export const AppDataSource = new DataSource(dbConfig); 