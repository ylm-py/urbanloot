import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @ApiProperty({ description: 'User ID' })
    @Type(() => Number)
    @IsNumber()
    id: number;
    
    @ApiProperty({ description: 'First Name' })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ description: 'Last Name' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ description: 'Phone number' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ description: 'Address' })
    @IsOptional()
    @IsString()
    address?: string;
}