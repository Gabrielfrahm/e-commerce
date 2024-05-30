import { IsUUID } from 'class-validator';

export class FindOneVariantDto {
  @IsUUID(4)
  id: string;
}
