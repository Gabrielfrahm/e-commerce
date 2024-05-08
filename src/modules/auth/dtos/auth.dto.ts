import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommandAuthDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OutputAuthDto {
  @IsString()
  token: string;
}
