import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { AddProductCartDto } from '@modules/client/dtos/add-product-cart.dto';
import { CartRepositoryInterface } from '@modules/client/interfaces/cart.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AddProductCartUseCase
  implements BaseUseCase<AddProductCartDto, Either<Error, string>>
{
  constructor(
    @Inject('cartRepository')
    private readonly cartRepository: CartRepositoryInterface,
  ) {}

  async execute(input: AddProductCartDto): Promise<Either<Error, string>> {
    const addProduct = await this.cartRepository.addProduct(input);
    if (addProduct.isLeft()) {
      return left(addProduct.value);
    }

    return right(addProduct.value);
  }
}
