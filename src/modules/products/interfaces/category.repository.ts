import { Either } from '@common/utils/either';
import { Category } from '../entities/categories.entity';
import { SearchCategoriesDto } from '../dtos/category/search-categories.dto';
import { Search } from '@common/interfaces/search.interface';

export interface CategoryRepositoryInterface {
  create(entity: Category): Promise<Either<Error, Category>>;
  findByName(name: string): Promise<Either<Error, Category>>;
  findById(id: string): Promise<Either<Error, Category>>;
  delete(id: string): Promise<Either<Error, void>>;
  update(entity: Category): Promise<Either<Error, Category>>;
  list(params?: SearchCategoriesDto): Promise<Either<Error, Search<Category>>>;
}
