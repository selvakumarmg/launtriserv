import { TypeOrmModuleOptions } from '@nestjs/typeorm';

interface DatabaseConfig {
  [key: string]: TypeOrmModuleOptions;
}

const databaseConfigs: DatabaseConfig = {
  local: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'launtriserv',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  },
  development: {
    type: 'mysql',
    host: process.env.DB_HOST || 'dev-db-host',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'dev_user',
    password: process.env.DB_PASS || 'dev_password',
    database: process.env.DB_NAME || 'launtriserv_dev',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  },
  production: {
    type: 'mysql',
    host: process.env.DB_HOST || 'prod-db-host',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'prod_user',
    password: process.env.DB_PASS || 'prod_password',
    database: process.env.DB_NAME || 'launtriserv_prod',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false, // Disable synchronize in production
    logging: false, // Disable logging in production
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const environment = process.env.NODE_ENV || 'local';
  return databaseConfigs[environment];
}; 