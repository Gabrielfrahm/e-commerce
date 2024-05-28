import { Either } from '@common/utils/either';
import { Products } from '../entities/products.entity';
import { SearchProductsDto } from '../dtos/product/search-product.dto';
import { Search } from '@common/interfaces/search.interface';

export interface ProductRepositoryInterface {
  create(entity: Products): Promise<Either<Error, Products>>;
  findById(id: string): Promise<Either<Error, Products>>;
  update(entity: Products): Promise<Either<Error, Products>>;
  delete(id: string): Promise<Either<Error, void>>;
  list(params?: SearchProductsDto): Promise<Either<Error, Search<Products>>>;
}
