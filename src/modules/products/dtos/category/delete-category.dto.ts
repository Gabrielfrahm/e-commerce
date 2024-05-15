import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteCategoryDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    example: 'uuid-v4',
    description: 'category id',
  })
  id: string;
}
