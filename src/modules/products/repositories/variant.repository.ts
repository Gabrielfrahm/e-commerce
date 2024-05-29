import { Either, left, right } from '@common/utils/either';
import { ProductsVariant } from '../entities/products-variant.entity';
import { VariantRepositoryInterface } from '../interfaces/variant.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { RepositoryException } from '@common/exceptions/repository.exception';
import { Products } from '../entities/products.entity';
import { Category } from '../entities/categories.entity';
import { ProductsVariantAttributes } from '../entities/products-variant-attributes.entity';
import { ProductsAttributes } from '../entities/products-attributes.entity';

@Injectable()
export class VariantRepository implements VariantRepositoryInterface {
  private model: PrismaService['productVariants'];
  private connection: PrismaService;

  constructor(prismaService: PrismaService) {
    this.model = prismaService.productVariants;
    this.connection = prismaService;
  }

  async create(
    entity: ProductsVariant,
  ): Promise<Either<Error, ProductsVariant>> {
    try {
      const checkVariant = await this.model.findUnique({
        where: {
          sku: entity.getSku(),
        },
      });

      if (checkVariant) {
        return left(
          new RepositoryException(
            `Variant already existi with sku : ${entity.getSku()}`,
            409,
          ),
        );
      }

      const variant = await this.model.create({
        data: {
          id: entity.getId(),
          productId: entity.getProduct().getId(),
          price: entity.getPrice(),
          promocionalPrice: entity.getPromotionalPrice(),
          sku: entity.getSku(),
          stockQuantity: entity.getStockQuantity(),
          createdAt: entity.getCreatedAt(),
          imageUrl: entity.getImageUrl(),
          updatedAt: entity.getUpdatedAt(),
          ProductVariantAttributes: {
            createMany: {
              data: entity.getAttributes().map((attribute) => ({
                id: attribute.getId(),
                productAttributeId: attribute.getProductAttribute().getId(),
                value: attribute.getValue(),
              })),
            },
          },
        },
        include: {
          product: {
            include: {
              ProductCategory: {
                include: {
                  category: true,
                },
              },
            },
          },
          ProductVariantAttributes: {
            include: {
              productAtrribute: true,
            },
          },
        },
      });

      return right(
        ProductsVariant.CreateFrom({
          ...variant,
          product: Products.CreateFrom({
            ...variant.product,
            categories: variant.product.ProductCategory.map((productCategory) =>
              Category.createFrom(productCategory.category),
            ),
          }),
          promotionalPrice: variant.promocionalPrice,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async findById(id: string): Promise<Either<Error, ProductsVariant>> {
    try {
      const variant = await this.model.findUnique({
        where: {
          id,
        },
        include: {
          product: {
            include: {
              ProductCategory: {
                include: {
                  category: true,
                },
              },
            },
          },
          ProductVariantAttributes: {
            include: {
              productAtrribute: true,
            },
          },
        },
      });

      if (!variant) {
        return left(
          new RepositoryException(`variant not found with id: ${id}`, 404),
        );
      }

      return right(
        ProductsVariant.CreateFrom({
          ...variant,
          product: Products.CreateFrom({
            ...variant.product,
            categories: variant.product.ProductCategory.map((productCategory) =>
              Category.createFrom(productCategory.category),
            ),
          }),
          promotionalPrice: variant.promocionalPrice,
          attributes: variant.ProductVariantAttributes.map((att) =>
            ProductsVariantAttributes.CreateFrom({
              id: att.id,
              productAttribute: ProductsAttributes.CreateFrom(
                att.productAtrribute,
              ),
              value: att.value,
            }),
          ),
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async update(
    entity: ProductsVariant,
  ): Promise<Either<Error, ProductsVariant>> {
    try {
      const variant = await this.model.findUnique({
        where: {
          id: entity.getId(),
        },
      });

      if (!variant) {
        return left(
          new RepositoryException(
            `Variant not found with id: ${entity.getId()}`,
            404,
          ),
        );
      }

      await this.model.update({
        where: {
          id: entity.getId(),
        },
        data: {
          ProductVariantAttributes: {
            deleteMany: {
              productVariantId: entity.getId(),
            },
          },
        },
      });

      const [updateVariant] = await this.connection.$transaction([
        this.model.update({
          where: {
            id: entity.getId(),
          },
          data: {
            id: entity.getId(),
            productId: entity.getProduct().getId(),
            price: entity.getPrice(),
            promocionalPrice: entity.getPromotionalPrice(),
            sku: entity.getSku(),
            stockQuantity: entity.getStockQuantity(),
            imageUrl: entity.getImageUrl(),
            updatedAt: entity.getUpdatedAt(),
            ProductVariantAttributes: {
              createMany: {
                data: entity.getAttributes().map((attribute) => ({
                  id: attribute.getId(),
                  productAttributeId: attribute.getProductAttribute().getId(),
                  value: attribute.getValue(),
                })),
              },
            },
          },
          include: {
            product: {
              include: {
                ProductCategory: {
                  include: {
                    category: true,
                  },
                },
              },
            },
            ProductVariantAttributes: {
              include: {
                productAtrribute: true,
              },
            },
          },
        }),
      ]);

      return right(
        ProductsVariant.CreateFrom({
          ...updateVariant,
          product: Products.CreateFrom({
            ...updateVariant.product,
            categories: updateVariant.product.ProductCategory.map(
              (productCategory) =>
                Category.createFrom(productCategory.category),
            ),
          }),
          promotionalPrice: updateVariant.promocionalPrice,
          attributes: updateVariant.ProductVariantAttributes.map((att) =>
            ProductsVariantAttributes.CreateFrom({
              id: att.id,
              productAttribute: ProductsAttributes.CreateFrom(
                att.productAtrribute,
              ),
              value: att.value,
            }),
          ),
        }),
      );
    } catch (e) {
      return left(e);
    }
  }
}
