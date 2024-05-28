import { IsUUID } from 'class-validator';

export class DeleteBaseProductDto {
  @IsUUID(4)
  id: string;
}
