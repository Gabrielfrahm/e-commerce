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

export class CreateVariantDto {
  @ApiProperty({
    description: 'id base product',
  })
  @IsUUID(4)
  productId: string;

  @ApiProperty({
    description: 'SKU for identifier product',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'normal price',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    description: 'promocional price',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  promotionalPrice: number;

  @ApiProperty({
    description: 'quantity of product in stock',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  stockQuantity: number;

  @ApiProperty({
    example: 'http://.....',
    description: 'base image product',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'array of name atributes',
  })
  @IsArray()
  @ArrayNotEmpty()
  attributes: { name: string; value: string }[];
}

export class OutputVariantDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  product: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'SKU for identifier product',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'normal price',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    description: 'promocional price',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  promotionalPrice: number;

  @ApiProperty({
    description: 'quantity of product in stock',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  stockQuantity: number;

  @ApiProperty({
    example: 'http://.....',
    description: 'base image product',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'array of ',
  })
  @IsArray()
  @ArrayNotEmpty()
  attributes: { id: string; value: string }[];
}
