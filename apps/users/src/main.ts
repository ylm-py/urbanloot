import { NestFactory } from '@nestjs/core';
import { AppModule } from './users.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4002,
        },
      },
    );
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(error => {
          return Object.values(error.constraints || {}).join(', ');
        });
        return new Error(`Validation failed: ${messages.join('; ')}`);
      } 
    }));
  await app.listen();
  console.log('Users microservice is running on TCP port 4002');

}
bootstrap();