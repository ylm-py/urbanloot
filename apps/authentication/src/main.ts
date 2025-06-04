import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4001,
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
  console.log('Authentication microservice is running on TCP port 4001');
}
bootstrap();
