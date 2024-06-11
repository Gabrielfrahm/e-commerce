import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class FindOneCardDto {
  @IsUUID(4)
  cardId: string;
}

export class FindOneCardOutputDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'main card',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'number of card',
  })
  number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'card holder name',
  })
  cardHolderName: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'year of card',
  })
  year: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'month of card',
  })
  month: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'code of verification card',
  })
  code: string;
}
