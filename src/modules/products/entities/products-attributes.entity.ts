import { randomUUID } from 'crypto';

export interface ProductsAttributesProps {
  id: string;
  name: string;
}

export class ProductsAttributes {
  private readonly id: string;
  private name: string;

  constructor(data: ProductsAttributesProps) {
    this.id = data.id;
    this.name = data.name;
  }

  static CreateNew(
    data: Omit<ProductsAttributesProps, 'id'>,
    id = randomUUID(),
  ): ProductsAttributes {
    return new ProductsAttributes({
      ...data,
      id,
    });
  }

  static CreateFrom(data: ProductsAttributesProps): ProductsAttributes {
    return new ProductsAttributes({
      id: data.id,
      name: data.name,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
    };
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
