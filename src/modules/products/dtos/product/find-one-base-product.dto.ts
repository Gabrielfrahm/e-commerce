import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindOneBaseProduct {
  @IsUUID(4)
  @ApiProperty({
    example: 'uuid-v4',
    description: 'id of base product',
  })
  id: string;
}
