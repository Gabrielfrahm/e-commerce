import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CommandUpdateCategoryDto {
  @IsUUID(4)
  @ApiProperty({
    example: 'uuid-v4',
    description: 'category id',
  })
  id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Moda',
    description: 'category name',
  })
  name: string;

  @IsOptional()
  @IsUUID(4)
  @ApiProperty({
    example: 'uuid-v4',
    description: 'if this category was related another',
  })
  parentCategoryId?: string;
}
