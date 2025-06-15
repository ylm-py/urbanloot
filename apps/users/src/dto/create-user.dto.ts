import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'User ID' })
    @IsNumber()
    id: number;
    
    @ApiProperty({ description: 'First Name' })
    firstName?: string;

    @ApiProperty({ description: 'Last Name' })
    lastName?: string;

    @ApiProperty({ description: 'Phone number' })
    @IsString()
    phone?: string;

    @ApiProperty({ description: 'Adress' })
    @IsOptional()
    @IsString()
    address?: string;
}