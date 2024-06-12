import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { CardDto, CardOutputDto } from '@modules/client/dtos/card/card.dto';
import { CardRepositoryInterface } from '@modules/client/interfaces/card.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllCardUseCase
  implements BaseUseCase<string, Either<Error, CardDto[]>>
{
  constructor(
    @Inject('cardRepository')
    private readonly cardRepository: CardRepositoryInterface,
  ) {}

  async execute(input: string): Promise<Either<Error, CardOutputDto[]>> {
    const cards = await this.cardRepository.findAll(input);

    if (cards.isLeft()) {
      return left(cards.value);
    }

    return right(
      cards.value.map((card) => ({
        userId: input,
        id: card.getId(),
        cardHolderName: card.getCardHolderName(),
        code: card.getCode(),
        month: card.getMonth(),
        number: card.getNumber(),
        title: card.getTitle(),
        year: card.getYear(),
      })),
    );
  }
}
