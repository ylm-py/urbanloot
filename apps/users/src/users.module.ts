import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.USERS_DB_HOST,
      port: 5432,
      username: process.env.USERS_DB_USERNAME,
      password: process.env.USERS_DB_PASSWORD,
      database: process.env.USERS_DB_NAME,
      entities: [User],
      synchronize: true, // Set to false in production
    }),
    
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
