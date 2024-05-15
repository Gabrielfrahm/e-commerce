import { Transform } from 'class-transformer';
import { OutputCategoryDto } from './category.dto';

export class SearchCategoriesDto {
  @Transform(({ value }) => Number(value))
  page?: number;

  @Transform(({ value }) => Number(value))
  perPage?: number;

  sortDir?: string;
  sort?: string;
  name?: string;
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
