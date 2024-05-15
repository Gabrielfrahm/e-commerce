import { Either } from '@common/utils/either';
import { Category } from '../entities/categories.entity';

export interface CategoryRepositoryInterface {
  create(entity: Category): Promise<Either<Error, Category>>;
  findByName(name: string): Promise<Either<Error, Category>>;
  findById(id: string): Promise<Either<Error, Category>>;
  delete(id: string): Promise<Either<Error, void>>;
  update(entity: Category): Promise<Either<Error, Category>>;
  list(): Promise<Either<Error, Category[]>>;
}
