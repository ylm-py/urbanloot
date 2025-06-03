import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: process.env.AUTH_DB_HOST,
        port: 5432,
        username: process.env.AUTH_DB_USERNAME,
        password: process.env.AUTH_DB_PASSWORD,
        database: process.env.AUTH_DB_NAME,
        entities: [User],
        synchronize: true, // Set to false in production
      }
    ), 
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
