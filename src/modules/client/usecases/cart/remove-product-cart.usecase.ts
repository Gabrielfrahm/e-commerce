import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { RemoveProductCartDto } from '@modules/client/dtos/remove-product-cart.dto';
import { CartRepositoryInterface } from '@modules/client/interfaces/cart.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RemoveProductCartUseCase
  implements BaseUseCase<RemoveProductCartDto, Either<Error, string>>
{
  constructor(
    @Inject('cartRepository')
    private readonly cartRepository: CartRepositoryInterface,
  ) {}

  async execute(input: RemoveProductCartDto): Promise<Either<Error, string>> {
    const removeProduct = await this.cartRepository.removeProduct(input);

    if (removeProduct.isLeft()) {
      return left(removeProduct.value);
    }

    return right(removeProduct.value);
  }
}
