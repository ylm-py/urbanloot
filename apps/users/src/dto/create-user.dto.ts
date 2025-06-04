import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Unique username' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'URL of the avatar image', required: false })
    @IsOptional()
    @IsString()
    avatarUrl?: string;
}