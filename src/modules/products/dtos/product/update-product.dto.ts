import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateProductDto {
  @IsUUID(4)
  @ApiProperty({
    example: 'uuid-v4',
    description: 'uuid',
  })
  id: string;

  @IsString()
  @ApiProperty({
    example: 'smartphone',
    description: 'name base product',
  })
  @IsOptional()
  name?: string;

  @IsString()
  @ApiProperty({
    example: 'smartphone with...',
    description: 'description base product',
  })
  @IsOptional()
  description?: string;

  // @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: '1200.00',
    description: 'base price in cents',
  })
  @Transform(({ value }) => Number(value))
  basePrice: number;

  // @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: '10',
    description: 'tax percentage',
  })
  @Transform(({ value }) => Number(value))
  taxRate: number;

  @ApiProperty({
    example: 'http://.....',
    description: 'base image product',
  })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: '[informática]',
    description: 'array of name categories',
  })
  @IsArray()
  @IsOptional()
  categories?: string[];
}
