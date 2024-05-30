import { Transform } from 'class-transformer';

import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OutputVariantDto } from './create-variant.dto';

export class SearchVariantsDto {
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

  @ApiProperty({
    example: 'uuid',
  })
  @IsUUID(4)
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'price for search',
  })
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'promocional price for search',
  })
  @IsOptional()
  promotionalPrice?: number;

  @ApiProperty({
    description: 'sku for identifier variant product',
  })
  @IsOptional()
  sku?: string;
}

export class OutputSearchVariantsDto {
  data: OutputVariantDto[];
  meta: {
    page: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}
