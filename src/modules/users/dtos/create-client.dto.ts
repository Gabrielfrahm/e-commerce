import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCommandClientDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;
}

export class CreateOutputClientDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    example: 'uuid v4',
  })
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'John Doe',
  })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'client',
  })
  type: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
