import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommandAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'yourpassword',
    description: 'Password for the account',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OutputAuthDto {
  @ApiProperty({ example: 'token' })
  @IsString()
  token: string;
}
