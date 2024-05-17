import { randomUUID } from 'crypto';
import { ProductsAttributes } from './products-attributes.entity';
import { ProductsVariant } from './products-variant.entity';

export interface ProductsVariantAttributesProps {
  id: string;
  productVariant: ProductsVariant;
  productAttribute: ProductsAttributes;
  value: string;
}

export class ProductsVariantAttributes {
  private id: ProductsVariantAttributesProps['id'];
  private productVariant: ProductsVariantAttributesProps['productVariant'];
  private productAttribute: ProductsVariantAttributesProps['productAttribute'];
  private value: ProductsVariantAttributesProps['value'];

  private constructor(data: ProductsVariantAttributesProps) {
    this.id = data.id;
    this.productAttribute = data.productAttribute;
    this.productVariant = data.productVariant;
    this.value = data.value;
  }

  static CreateNew(
    data: Omit<ProductsVariantAttributesProps, 'id'>,
    id = randomUUID(),
  ): ProductsVariantAttributes {
    return new ProductsVariantAttributes({
      ...data,
      id,
    });
  }

  static CreateFrom(
    data: ProductsVariantAttributesProps,
  ): ProductsVariantAttributes {
    return new ProductsVariantAttributes({
      id: data.id,
      productAttribute: data.productAttribute,
      productVariant: data.productVariant,
      value: data.value,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      productAttribute: this.productAttribute,
      productVariant: this.productVariant,
      value: this.value,
    };
  }

  getId(): string {
    return this.id;
  }

  getProductVariant(): ProductsVariant {
    return this.productVariant;
  }

  getProductAttribute(): ProductsAttributes {
    return this.productAttribute;
  }

  getValue(): string {
    return this.value;
  }
}
