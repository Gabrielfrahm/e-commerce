import { Either } from '@common/utils/either';
import { ProductsVariant } from '../entities/products-variant.entity';
import { SearchVariantsDto } from '../dtos/product/variant/search-variant.dto';
import { Search } from '@common/interfaces/search.interface';

export interface VariantRepositoryInterface {
  create(entity: ProductsVariant): Promise<Either<Error, ProductsVariant>>;
  findById(id: string): Promise<Either<Error, ProductsVariant>>;
  update(entity: ProductsVariant): Promise<Either<Error, ProductsVariant>>;
  delete(id: string): Promise<Either<Error, void>>;
  list(
    params: SearchVariantsDto,
  ): Promise<Either<Error, Search<ProductsVariant>>>;
}
