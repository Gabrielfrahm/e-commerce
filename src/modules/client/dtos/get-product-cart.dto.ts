import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetProductCartDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of client',
  })
  clientId: string;
}

export class OutputProductCartDto {
  items: {
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
}
