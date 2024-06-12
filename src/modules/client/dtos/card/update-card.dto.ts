import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCardDto {
  @IsUUID(4)
  @ApiProperty({
    description: 'uuid card',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'main card',
  })
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty({
    description: 'number of card',
  })
  @IsOptional()
  number?: string;

  @IsString()
  @ApiProperty({
    description: 'card holder name',
  })
  @IsOptional()
  cardHolderName?: string;

  @IsNumber()
  @ApiProperty({
    description: 'year of card',
  })
  @IsOptional()
  year?: number;

  @IsNumber()
  @ApiProperty({
    description: 'month of card',
  })
  @IsOptional()
  month?: number;

  @IsString()
  @ApiProperty({
    description: 'code of verification card',
  })
  @IsOptional()
  code?: string;
}
