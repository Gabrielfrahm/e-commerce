import { IsDate, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateUserCodeDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsUUID(4)
  @IsNotEmpty()
  userId: string;
}

export class OutputUserCodeDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @IsUUID(4)
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsDate()
  createdAt: Date;
}
