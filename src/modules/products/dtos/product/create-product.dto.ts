import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'smartphone',
    description: 'name base product',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'smartphone with...',
    description: 'description base product',
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '1200.00',
    description: 'base price in cents',
  })
  @Transform(({ value }) => Number(value))
  basePrice: number;

  @IsNumber()
  @IsNotEmpty()
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
  imageUrl: string;

  @ApiProperty({
    example: '[informática]',
    description: 'array of name categories',
  })
  @IsArray()
  @ArrayNotEmpty()
  categories: string[];
}

export class OutputProductDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'smartphone',
    description: 'name base product',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'smartphone with...',
    description: 'description base product',
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '1200.00',
    description: 'base price in cents',
  })
  @Transform(({ value }) => Number(value))
  basePrice: number;

  @IsNumber()
  @IsNotEmpty()
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
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    example: '{ id: string; name: string }',
    description: 'array of name categories',
  })
  @IsNotEmpty()
  categories: { id: string; name: string }[];

  variants?: [];
}
