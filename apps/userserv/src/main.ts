import { NestFactory } from '@nestjs/core';
import { UserservModule } from './userserv.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UserservModule);
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('LauntriServ API')
    .setDescription('The LauntriServ API description')
    .setVersion('1.0')
    .addTag('customers')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.port ?? 3001);
}
bootstrap();
