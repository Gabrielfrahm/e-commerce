import { PrismaService } from '@modules/database/prisma/prisma.service';
import { ProductRepositoryInterface } from '../interfaces/product.repository';
import { Either, left, right } from '@common/utils/either';
import { Products } from '../entities/products.entity';
import { RepositoryException } from '@common/exceptions/repository.exception';
import { Category } from '../entities/categories.entity';
import { Injectable } from '@nestjs/common';
import { Search } from '@common/interfaces/search.interface';
import { SearchProductsDto } from '../dtos/product/search-product.dto';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  private model: PrismaService['product'];
  private connection: PrismaService;
  constructor(prismaService: PrismaService) {
    this.model = prismaService.product;
    this.connection = prismaService;
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

  async update(entity: Products): Promise<Either<Error, Products>> {
    try {
      const product = await this.model.findUnique({
        where: {
          id: entity.getId(),
        },
      });

      if (!product) {
        return left(
          new RepositoryException(
            `product not found with id${entity.getId()}`,
            404,
          ),
        );
      }

      const checkName = await this.model.findUnique({
        where: {
          name: entity.getName(),
        },
      });

      if (checkName && checkName.id !== product.id) {
        return left(
          new RepositoryException(
            `product with name ${entity.getName()} already exist`,
            409,
          ),
        );
      }

      await this.model.update({
        where: {
          id: entity.getId(),
        },
        data: {
          ProductCategory: {
            deleteMany: {
              productId: entity.getId(),
            },
          },
        },
      });

      const updateProduct = await this.model.update({
        where: {
          id: entity.getId(),
        },
        data: {
          id: entity.getId(),
          basePrice: entity.getBasePrice(),
          description: entity.getDescription(),
          name: entity.getName(),
          taxRate: entity.getTaxRate(),
          imageUrl: entity.getImageUrl(),
          updatedAt: entity.getUpdatedAt(),
          ProductCategory: {
            createMany: {
              data: entity.getCategories().map((category) => ({
                categoryId: category.getId(),
              })),
            },
          },
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
          ...updateProduct,
          categories: updateProduct.ProductCategory.map((productCategory) =>
            Category.createFrom(productCategory.category),
          ),
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async delete(id: string): Promise<Either<Error, void>> {
    try {
      const product = await this.model.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        return left(
          new RepositoryException(`product not found with id ${id}`, 404),
        );
      }

      await this.model.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return right(null);
    } catch (e) {
      return left(e);
    }
  }

  async list({
    page = 1,
    perPage = 10,
    name,
    basePrice,
    categoryName,
    deletedAt,
    description,
    taxRate,
    sort,
    sortDir,
  }: SearchProductsDto): Promise<Either<Error, Search<Products>>> {
    const skip = (page - 1) * perPage;
    const take = perPage;
    const filters: any = {
      deletedAt: null,
      ...(deletedAt && {
        deletedAt: {
          not: null,
        },
      }),
      ...(name && {
        name: {
          mode: 'insensitive',
          contains: name,
        },
      }),
      ...(description && {
        description: {
          mode: 'insensitive',
          contains: description,
        },
      }),
      ...(categoryName && {
        ProductCategory: {
          some: {
            category: {
              name: {
                mode: 'insensitive',
                contains: categoryName,
              },
            },
          },
        },
      }),
      ...(basePrice && {
        basePrice: {
          in: [basePrice],
        },
      }),
      ...(taxRate && {
        taxRate: {
          in: [taxRate],
        },
      }),
    };
    try {
      const [products, count] = await this.connection.$transaction([
        this.model.findMany({
          where: filters,
          orderBy: {
            [sort ?? 'createdAt']: sortDir ?? 'desc',
          },
          skip: skip,
          take: take,
          include: {
            ProductCategory: {
              select: {
                category: true,
              },
            },
          },
        }),
        this.model.count({
          where: filters,
        }),
      ]);

      const lastPage = Math.ceil(count / take);

      return right({
        data: products.map((product) =>
          Products.CreateFrom({
            ...product,
            categories: product.ProductCategory.map((productCategory) =>
              Category.createFrom(productCategory.category),
            ),
          }),
        ),
        meta: {
          page: page,
          perPage: take,
          total: count,
          lastPage: lastPage,
        },
      });
    } catch (e) {
      return left(e);
    }
  }
}
