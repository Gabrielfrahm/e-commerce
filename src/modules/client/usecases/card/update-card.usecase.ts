import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { FindOneCardOutputDto } from '@modules/client/dtos/card/find-one-card.dto';
import { UpdateCardDto } from '@modules/client/dtos/card/update-card.dto';
import { CardRepositoryInterface } from '@modules/client/interfaces/card.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateCardUseCase
  implements BaseUseCase<UpdateCardDto, Either<Error, FindOneCardOutputDto>>
{
  constructor(
    @Inject('cardRepository')
    private readonly cardRepository: CardRepositoryInterface,
  ) {}

  async execute(
    input: UpdateCardDto,
  ): Promise<Either<Error, FindOneCardOutputDto>> {
    const card = await this.cardRepository.findOne(input.id);
    if (card.isLeft()) {
      return left(card.value);
    }

    card.value.update(input);

    const updateCard = await this.cardRepository.update(card.value);

    if (updateCard.isLeft()) {
      return left(updateCard.value);
    }

    return right({
      id: card.value.getId(),
      cardHolderName: card.value.getCardHolderName(),
      code: card.value.getCode(),
      month: card.value.getMonth(),
      number: card.value.getNumber(),
      title: card.value.getTitle(),
      year: card.value.getYear(),
    });
  }
}
