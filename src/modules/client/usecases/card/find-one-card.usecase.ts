import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import {
  FindOneCardDto,
  FindOneCardOutputDto,
} from '@modules/client/dtos/card/find-one-card.dto';

import { CardRepositoryInterface } from '@modules/client/interfaces/card.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FindCardUseCase
  implements BaseUseCase<FindOneCardDto, Either<Error, FindOneCardOutputDto>>
{
  constructor(
    @Inject('cardRepository')
    private readonly cardRepository: CardRepositoryInterface,
  ) {}

  async execute(
    input: FindOneCardDto,
  ): Promise<Either<Error, FindOneCardOutputDto>> {
    const card = await this.cardRepository.findOne(input.cardId);

    if (card.isLeft()) {
      return left(card.value);
    }

    return right({
      cardHolderName: card.value.getCardHolderName(),
      code: card.value.getCode(),
      month: card.value.getMonth(),
      number: card.value.getNumber(),
      title: card.value.getTitle(),
      year: card.value.getYear(),
    });
  }
}
