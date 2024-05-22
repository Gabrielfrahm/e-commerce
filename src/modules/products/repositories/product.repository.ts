import { PrismaService } from '@modules/database/prisma/prisma.service';
import { ProductRepositoryInterface } from '../interfaces/product.repository';
import { Either, left, right } from '@common/utils/either';
import { Products } from '../entities/products.entity';
import { RepositoryException } from '@common/exceptions/repository.exception';
import { Category } from '../entities/categories.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  private model: PrismaService['product'];
  constructor(prismaService: PrismaService) {
    this.model = prismaService.product;
  }

  async create(entity: Products): Promise<Either<Error, Products>> {
    try {
      const checkProduct = await this.model.findUnique({
        where: {
          name: entity.getName(),
        },
      });

      if (checkProduct) {
        return left(new RepositoryException('Base Product Already exist', 409));
      }

      const product = await this.model.create({
        data: {
          id: entity.getId(),
          basePrice: entity.getBasePrice(),
          description: entity.getDescription(),
          name: entity.getName(),
          taxRate: entity.getTaxRate(),
          imageUrl: entity.getImageUrl(),
          ProductCategory: {
            createMany: {
              data: entity.getCategories().map((category) => ({
                categoryId: category.getId(),
              })),
            },
          },
          createdAt: entity.getCreatedAt(),
          updatedAt: entity.getUpdatedAt(),
          deletedAt: entity.getDeletedAt(),
        },
        include: {
          ProductCategory: {
            select: {
              category: true,
            },
          },
        },
      });

      return right(
        Products.CreateFrom({
          ...product,
          categories: product.ProductCategory.map((productCategory) =>
            Category.createFrom(productCategory.category),
          ),
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async findById(id: string): Promise<Either<Error, Products>> {
    try {
      const product = await this.model.findUnique({
        where: {
          id,
        },
        include: {
          ProductCategory: {
            select: {
              category: true,
            },
          },
        },
      });

      if (!product) {
        return left(
          new RepositoryException(`Product not found with id ${id}`, 404),
        );
      }

      return right(
        Products.CreateFrom({
          ...product,
          categories: product.ProductCategory.map((productCategory) =>
            Category.createFrom(productCategory.category),
          ),
        }),
      );
    } catch (e) {
      return left(e);
    }
  }
}
