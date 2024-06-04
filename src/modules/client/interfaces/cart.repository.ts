import { Either } from '@common/utils/either';
import { Cart } from '../entities/cart.entity';

export interface CartRepositoryInterface {
  addProduct(data: {
    clientId: string;
    productId: string;
    quantity: number;
  }): Promise<Either<Error, string>>;
  removeProduct(data: {
    clientId: string;
    productId: string;
    quantity: number;
  }): Promise<Either<Error, string>>;
  findCart(clientId: string): Promise<Either<Error, Cart>>;
}
