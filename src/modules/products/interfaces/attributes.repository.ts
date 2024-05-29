import { Either } from '@common/utils/either';
import { ProductsAttributes } from '../entities/products-attributes.entity';

export interface AttributesRepositoryInterface {
  findByName(name: string): Promise<Either<Error, ProductsAttributes>>;
}
