import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateUserCodeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '000000',
    description: 'code for create or recovery password',
  })
  code: number;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    example: 'uuid-v4',
    description: 'id user',
  })
  userId: string;
}

export class OutputUserCodeDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    example: 'uuid-v4',
    description: 'id code',
  })
  id: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    example: 'uuid-v4',
    description: 'id user',
  })
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '000000',
    description: 'code for create or recovery password',
  })
  code: number;

  @IsDate()
  @ApiProperty({
    example: `${new Date()}`,
    description: 'date of creation code',
  })
  createdAt: Date;
}
