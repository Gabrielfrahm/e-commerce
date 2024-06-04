import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class AddProductCartDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of client',
  })
  clientId: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of product to add in cart',
  })
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'quantity to item in cart',
  })
  quantity: number;
}
