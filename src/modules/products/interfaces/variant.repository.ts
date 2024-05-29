import { Either } from '@common/utils/either';
import { ProductsVariant } from '../entities/products-variant.entity';

export interface VariantRepositoryInterface {
  create(entity: ProductsVariant): Promise<Either<Error, ProductsVariant>>;
  findById(id: string): Promise<Either<Error, ProductsVariant>>;
  update(entity: ProductsVariant): Promise<Either<Error, ProductsVariant>>;
}
