import { Transform } from 'class-transformer';

import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OutputVariantDto } from './create-variant.dto';

export class SearchClintVariantsDto {
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

export class OutputSearchClientVariantsDto {
  data: OutputVariantDto[];
  meta: {
    page: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}
