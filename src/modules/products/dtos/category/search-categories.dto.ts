import { Transform } from 'class-transformer';
import { OutputCategoryDto } from './category.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCategoriesDto {
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
    description: 'name of category',
  })
  name?: string;

  @IsOptional()
  @ApiProperty({
    example: 'smartphones',
    description: 'name of parent category',
  })
  parentName?: string;
}

export class OutputSearchCategoriesDto {
  data: OutputCategoryDto[];
  meta: {
    page: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}
