import { IsUUID } from 'class-validator';

export class DeleteVariantDto {
  @IsUUID(4)
  id: string;
}
