import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClientCommandAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateClientOutputAuthDto {
  @ApiProperty({ example: 'token' })
  @IsString()
  token: string;
}
