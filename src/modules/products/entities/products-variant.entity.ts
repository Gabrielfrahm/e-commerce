import { BaseEntity, BaseEntityProps } from '@common/utils/base.entity';
import { ProductsVariantAttributes } from './products-variant-attributes.entity';
import { Products } from './products.entity';
import { randomUUID } from 'crypto';

export interface ProductsVariantProps extends BaseEntityProps {
  product: Products;
  sku: string;
  price: number;
  promotionalPrice: number;
  stockQuantity: number;
  imageUrl: string | null;
  attributes?: ProductsVariantAttributes[];
}

export class ProductsVariant extends BaseEntity {
  private product: ProductsVariantProps['product'];
  private sku: ProductsVariantProps['sku'];
  private price: ProductsVariantProps['price'];
  private promotionalPrice: ProductsVariantProps['promotionalPrice'];
  private stockQuantity: ProductsVariantProps['stockQuantity'];
  private imageUrl: ProductsVariantProps['imageUrl'];
  private attributes: ProductsVariantProps['attributes'];

  constructor(data: ProductsVariantProps) {
    super(data);
  }

  static CreateNew(
    data: Omit<
      ProductsVariantProps,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
    id = randomUUID(),
  ): ProductsVariant {
    return new ProductsVariant({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static CreateFrom(data: ProductsVariantProps): ProductsVariant {
    return new ProductsVariant({
      id: data.id,
      attributes: data.attributes,
      imageUrl: data.imageUrl,
      price: data.price,
      product: data.product,
      promotionalPrice: data.promotionalPrice,
      sku: data.sku,
      stockQuantity: data.stockQuantity,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      attributes: this.attributes.map((attribute) => attribute.serialize()),
      imageUrl: this.imageUrl,
      price: this.price,
      product: this.product,
      promotionalPrice: this.promotionalPrice,
      sku: this.sku,
      stockQuantity: this.stockQuantity,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  Update(data: Partial<ProductsVariantProps>): void {
    if (data.price) {
      this.price = Number(data.price);
    }

    if (data.promotionalPrice) {
      this.promotionalPrice = Number(data.promotionalPrice);
    }

    if (data.imageUrl) {
      this.imageUrl = data.imageUrl;
    }

    if (data.stockQuantity) {
      this.stockQuantity = Number(data.stockQuantity);
    }

    this.updatedAt = new Date();
  }

  getProduct(): Products {
    return this.product;
  }

  getSku(): string {
    return this.sku;
  }

  getPrice(): number {
    return this.price;
  }

  getPromotionalPrice(): number {
    return this.promotionalPrice;
  }

  getStockQuantity(): number {
    return this.stockQuantity;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getAttributes(): ProductsVariantAttributes[] {
    return this.attributes;
  }

  setAttributes(attributes: ProductsVariantAttributes[]): void {
    this.attributes = attributes;
  }
}
