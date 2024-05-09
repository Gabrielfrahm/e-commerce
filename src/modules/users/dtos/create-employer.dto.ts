import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateEmployerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    description: 'name of user',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;
}

export class CreateOutputEmployerDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    example: 'uuid v4',
  })
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'employer',
  })
  type: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
