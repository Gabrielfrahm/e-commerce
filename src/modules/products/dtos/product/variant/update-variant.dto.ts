import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateVariantDto {
  @ApiProperty({
    description: 'uuidv4',
  })
  @IsUUID(4)
  variantId: string;

  @ApiProperty({
    description: 'normal price',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  price?: number;

  @ApiProperty({
    description: 'promocional price',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  promotionalPrice?: number;

  @ApiProperty({
    description: 'quantity of product in stock',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  stockQuantity?: number;

  @ApiProperty({
    example: 'http://.....',
    description: 'base image product',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'array of name atributes',
  })
  @IsArray()
  @IsOptional()
  attributes?: { name: string; value: string }[];
}
