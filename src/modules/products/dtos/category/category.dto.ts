import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CommandCreateCategoryDto {
  @IsString()
  @IsNotEmpty()
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

export class OutputCategoryDto {
  @IsUUID(4)
  @ApiProperty({
    example: 'uuid-v4',
    description: 'primary key',
  })
  id: string;

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

  parentCategory?: OutputCategoryDto;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
