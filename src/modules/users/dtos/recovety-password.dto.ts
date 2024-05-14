import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoveryPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'teste@teste.com',
    description:
      'That address email will receive an email for recovery password',
  })
  email: string;
}
