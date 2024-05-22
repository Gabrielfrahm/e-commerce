import { BaseEntity, BaseEntityProps } from '@common/utils/base.entity';
import { ProductsVariant } from './products-variant.entity';
import { randomUUID } from 'crypto';
import { Category } from './categories.entity';

export interface ProductsProps extends BaseEntityProps {
  name: string;
  description: string;
  basePrice: number;
  taxRate: number;
  imageUrl: string | null;
  categories: Category[];
  variants?: ProductsVariant[];
}

export class Products extends BaseEntity {
  private name: ProductsProps['name'];
  private description: ProductsProps['description'];
  private basePrice: ProductsProps['basePrice'];
  private taxRate: ProductsProps['taxRate'];
  private imageUrl: ProductsProps['imageUrl'];
  private categories: ProductsProps['categories'];
  private variants: ProductsProps['variants'];

  constructor(data: ProductsProps) {
    super(data);
  }

  static CreateNew(
    data: Omit<ProductsProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    id = randomUUID(),
  ): Products {
    return new Products({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static CreateFrom(data: ProductsProps): Products {
    return new Products({
      id: data.id,
      basePrice: data.basePrice,
      description: data.description,
      imageUrl: data.imageUrl,
      name: data.name,
      taxRate: data.taxRate,
      categories: data.categories,
      variants: data.variants,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      basePrice: this.basePrice,
      description: this.description,
      imageUrl: this.imageUrl,
      name: this.name,
      taxRate: this.taxRate,
      categories: this.categories.map((category) => category.serialize()),
      variants: this.variants.map((variant) => variant.serialize()),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }

  getBasePrice(): number {
    return this.basePrice;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getTaxRate(): number {
    return this.taxRate;
  }

  getImageUrl(): string | null {
    return this.imageUrl;
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getVariants(): ProductsVariant[] {
    return this.variants;
  }
}
