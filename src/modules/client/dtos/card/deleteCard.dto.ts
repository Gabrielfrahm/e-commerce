import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteCardDto {
  @IsUUID(4)
  @IsNotEmpty()
  cardId: string;
}
