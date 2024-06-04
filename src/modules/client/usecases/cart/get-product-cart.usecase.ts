import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import {
  GetProductCartDto,
  OutputProductCartDto,
} from '@modules/client/dtos/get-product-cart.dto';
import { CartRepositoryInterface } from '@modules/client/interfaces/cart.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetProductCartUseCase
  implements
    BaseUseCase<GetProductCartDto, Either<Error, OutputProductCartDto>>
{
  constructor(
    @Inject('cartRepository')
    private readonly cartRepository: CartRepositoryInterface,
  ) {}

  async execute(
    input: GetProductCartDto,
  ): Promise<Either<Error, OutputProductCartDto>> {
    const cart = await this.cartRepository.findCart(input.clientId);

    if (cart.isLeft()) {
      return left(cart.value);
    }

    return right({
      items: cart.value.getItems().map((item) => ({
        name: item.item.getProduct().getName(),
        imageUrl: item.item.getImageUrl(),
        price: item.item.getPrice(),
        quantity: item.quantity,
      })),
      totalPrice: cart.value.getTotal(),
    });
  }
}
