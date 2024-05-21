import { PrismaService } from '@modules/database/prisma/prisma.service';
import { ProductRepositoryInterface } from '../interfaces/product.repository';
import { Either, left, right } from '@common/utils/either';
import { Products } from '../entities/products.entity';
import { RepositoryException } from '@common/exceptions/repository.exception';

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
        return left(new RepositoryException('Base Product Already exist', 400));
      }

      const product = await this.model.create({
        data: {
          id: entity.getId(),
          basePrice: entity.getBasePrice(),
          description: entity.getDescription(),
          name: entity.getName(),
          taxRate: entity.getTaxRate(),
          imageUrl: entity.getImageUrl(),
          createdAt: entity.getCreatedAt(),
          updatedAt: entity.getUpdatedAt(),
          deletedAt: entity.getDeletedAt(),
        },
      });

      return right(Products.CreateFrom(product));
    } catch (e) {
      return left(e);
    }
  }
}
