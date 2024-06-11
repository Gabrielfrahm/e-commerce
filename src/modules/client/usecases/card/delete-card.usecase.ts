import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { DeleteCardDto } from '@modules/client/dtos/card/deleteCard.dto';
import { CardRepositoryInterface } from '@modules/client/interfaces/card.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteCardUseCase
  implements BaseUseCase<DeleteCardDto, Either<Error, void>>
{
  constructor(
    @Inject('cardRepository')
    private readonly cardRepository: CardRepositoryInterface,
  ) {}

  async execute(input: DeleteCardDto): Promise<Either<Error, void>> {
    const deleteCard = await this.cardRepository.delete(input.cardId);

    if (deleteCard.isLeft()) {
      return left(deleteCard.value);
    }

    return right(deleteCard.value);
  }
}
