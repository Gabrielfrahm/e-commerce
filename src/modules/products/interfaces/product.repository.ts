import { Either } from '@common/utils/either';
import { Products } from '../entities/products.entity';

export interface ProductRepositoryInterface {
  create(entity: Products): Promise<Either<Error, Products>>;
  findById(id: string): Promise<Either<Error, Products>>;
}
