import { NestFactory } from '@nestjs/core';
import { UserservModule } from './userserv.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@app/common/errors';
import { AppDataSource } from './database/data-source';

async function bootstrap() {
  try {
    // Initialize database connection
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
    
    const app = await NestFactory.create(UserservModule);
    
    // Set global prefix
    app.setGlobalPrefix('api');
    
    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());
    
    // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('LauntriServ API')
      .setDescription('The LauntriServ API description')
      .setVersion('1.0')
      .addTag('customers')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const port = process.env.port ?? 3001;
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
  } catch (error) {
    console.error('Error during application startup:', error);
    process.exit(1);
  }
}
bootstrap();
