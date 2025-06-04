import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'User email address' })
    @IsEmail({}, { message: 'Email is invalid' })
    email: string;
    
    @ApiProperty({ description: 'User password' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  }