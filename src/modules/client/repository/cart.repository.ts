import { Injectable } from '@nestjs/common';
import { CartRepositoryInterface } from '../interfaces/cart.repository';
import { Either, left, right } from '@common/utils/either';
import { Cart } from '../entities/cart.entity';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { ProductsVariant } from '@modules/products/entities/products-variant.entity';
import { Products } from '@modules/products/entities/products.entity';
import { Category } from '@modules/products/entities/categories.entity';
import { ProductsAttributes } from '@modules/products/entities/products-attributes.entity';
import { ProductsVariantAttributes } from '@modules/products/entities/products-variant-attributes.entity';

@Injectable()
export class CartRepository implements CartRepositoryInterface {
  private readonly model: PrismaService['cart'];

  constructor(prismaService: PrismaService) {
    this.model = prismaService.cart;
  }

  async addProduct(data: {
    clientId: string;
    productId: string;
    quantity: number;
  }): Promise<Either<Error, string>> {
    try {
      const checkProduct = await this.model.findFirst({
        where: {
          productVariantId: data.productId,
          userId: data.clientId,
        },
      });

      if (checkProduct) {
        await this.model.update({
          where: {
            productVariantId_userId: {
              productVariantId: checkProduct.productVariantId,
              userId: checkProduct.userId,
            },
          },
          data: {
            quantity: checkProduct.quantity + 1,
          },
        });

        return right('ok');
      }

      await this.model.create({
        data: {
          quantity: data.quantity,
          productVariantId: data.productId,
          userId: data.clientId,
        },
      });

      return right('ok');
    } catch (e) {
      return left(e);
    }
  }

  async removeProduct(data: {
    clientId: string;
    productId: string;
    quantity: number;
  }): Promise<Either<Error, string>> {
    try {
      const checkProduct = await this.model.findFirst({
        where: {
          productVariantId: data.productId,
          userId: data.clientId,
        },
      });

      if (checkProduct) {
        if (checkProduct.quantity === data.quantity) {
          await this.model.deleteMany({
            where: {
              productVariantId: data.productId,
              userId: data.clientId,
            },
          });

          return right('ok');
        }

        if (checkProduct.quantity > data.quantity) {
          await this.model.update({
            where: {
              productVariantId_userId: {
                productVariantId: checkProduct.productVariantId,
                userId: checkProduct.userId,
              },
            },
            data: {
              quantity: checkProduct.quantity - data.quantity,
            },
          });
          return right('ok');
        }
      }
      if (!checkProduct) {
        return right('ok');
      }
    } catch (e) {
      return left(e);
    }
  }

  async findCart(clientId: string): Promise<Either<Error, Cart>> {
    try {
      const products = await this.model.findMany({
        where: {
          userId: clientId,
        },
        include: {
          productVariant: {
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
          },
        },
      });

      return right(
        Cart.CreateFrom({
          id: 'not-used-this',
          items: products.map((product) => ({
            item: ProductsVariant.CreateFrom({
              id: product.productVariant.id,
              imageUrl: product.productVariant.imageUrl,
              createdAt: product.createdAt,
              price: product.productVariant.price,
              promotionalPrice: product.productVariant.promocionalPrice,
              sku: product.productVariant.sku,
              stockQuantity: product.productVariant.stockQuantity,
              updatedAt: product.productVariant.updatedAt,
              product: Products.CreateFrom({
                ...product.productVariant.product,
                categories: product.productVariant.product.ProductCategory.map(
                  (productCategory) =>
                    Category.createFrom(productCategory.category),
                ),
              }),
              attributes: product.productVariant.ProductVariantAttributes.map(
                (att) =>
                  ProductsVariantAttributes.CreateFrom({
                    id: att.id,
                    productAttribute: ProductsAttributes.CreateFrom(
                      att.productAtrribute,
                    ),
                    value: att.value,
                  }),
              ),
            }),
            quantity: product.quantity,
          })),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
    } catch (e) {
      return left(e);
    }
  }
}
