import { BaseEntity, BaseEntityProps } from '@common/utils/base.entity';
import { ProductsVariant } from '@modules/products/entities/products-variant.entity';
import { randomUUID } from 'crypto';

export interface CartProps extends BaseEntityProps {
  items: { item: ProductsVariant; quantity: number }[];
  totalPrice?: number;
}

export class Cart extends BaseEntity {
  private items: CartProps['items'];
  private totalPrice: CartProps['totalPrice'];

  private constructor(data: CartProps) {
    super(data);
  }

  static CreateNew(
    data: Omit<CartProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    id = randomUUID(),
  ): Cart {
    return new Cart({
      id: id,
      ...data,
      totalPrice: data.items.reduce(
        (acc, item) => acc + item.item.getPrice() * item.quantity,
        0,
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static CreateFrom(data: CartProps): Cart {
    return new Cart({
      ...data,
      totalPrice: data.items.reduce(
        (acc, item) => acc + item.item.getPrice() * item.quantity,
        0,
      ),
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      items: this.items.map((item) => item.item.serialize()),
      totalPrice: this.totalPrice,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  getTotal(): number {
    return this.items.reduce(
      (acc, item) => acc + item.item.getPrice() * item.quantity,
      0,
    );
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.item.getId() !== productId);
  }

  addItem(data: { item: ProductsVariant; quantity: number }): void {
    this.items.push(data);
  }

  getItems(): { item: ProductsVariant; quantity: number }[] {
    return this.items;
  }
}
