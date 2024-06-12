import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { CardDto, CardOutputDto } from '@modules/client/dtos/card/card.dto';
import { Card } from '@modules/client/entities/card.entity';
import { CardRepositoryInterface } from '@modules/client/interfaces/card.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateCardUseCase
  implements BaseUseCase<CardDto, Either<Error, CardOutputDto>>
{
  constructor(
    @Inject('cardRepository')
    private readonly cardRepository: CardRepositoryInterface,
  ) {}

  async execute(input: CardDto): Promise<Either<Error, CardOutputDto>> {
    const cardEntity = Card.CreateNew({
      cardHolderName: input.cardHolderName,
      code: input.code,
      month: input.month,
      number: input.number,
      title: input.title,
      year: input.year,
    });

    const card = await this.cardRepository.create(cardEntity, input.userId);

    if (card.isLeft()) {
      return left(card.value);
    }

    return right({
      userId: input.userId,
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
