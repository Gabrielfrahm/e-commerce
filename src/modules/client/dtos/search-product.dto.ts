import { Transform } from 'class-transformer';

import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OutputProductDto } from '@modules/products/dtos/product/create-product.dto';

export class SearchProductsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 1,
    description: 'number of page',
  })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 10,
    description: 'number of items in page',
  })
  perPage?: number;

  @IsOptional()
  @ApiProperty({
    example: 'desc',
    description: 'direction desired for order items',
  })
  sortDir?: string;

  @IsOptional()
  @ApiProperty({
    example: 'createdAt',
    description: 'field desired for order items',
  })
  sort?: string;

  @IsOptional()
  @ApiProperty({
    example: 'smartphones',
    description: 'name of base product',
  })
  name?: string;

  @IsOptional()
  @ApiProperty({
    example: 'smartphones',
    description: 'description of base product',
  })
  description?: string;

  @IsOptional()
  @ApiProperty({
    example: 'periféricos',
    description: 'name of category',
  })
  categoryName?: string;

  @IsOptional()
  @ApiProperty({
    example: '100000',
    description: 'base price of base product',
  })
  @Transform(({ value }) => Number(value))
  basePrice?: number;

  @IsOptional()
  @ApiProperty({
    example: 'true',
    description: 'base product deleted or not',
  })
  deletedAt?: boolean;

  @IsOptional()
  @ApiProperty({
    example: '110',
    description: 'base product tax rate percentage',
  })
  @Transform(({ value }) => Number(value))
  taxRate?: number;
}

export class OutputSearchProductsDto {
  data: OutputProductDto[];
  meta: {
    page: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}
