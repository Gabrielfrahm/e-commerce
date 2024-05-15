/* eslint-disable @typescript-eslint/no-unused-vars */
import { Either, left, right } from '@common/utils/either';
import { Category } from '../entities/categories.entity';
import { CategoryRepositoryInterface } from '../interfaces/category.repository';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { RepositoryException } from '@common/exceptions/repository.exception';

export class CategoryRepository implements CategoryRepositoryInterface {
  private model: PrismaService['category'];
  constructor(prismaService: PrismaService) {
    this.model = prismaService.category;
  }

  async create(entity: Category): Promise<Either<Error, Category>> {
    try {
      const check = await this.model.findUnique({
        where: {
          name: entity.getName(),
        },
      });

      if (check) {
        return left(
          new RepositoryException(
            `Category already existi ${entity.getName()}`,
            409,
          ),
        );
      }

      await this.model.create({
        data: {
          name: entity.getName(),
          parentCategoryId: entity.getParentCategoryId(),
          createdAt: entity.getCreatedAt(),
          updatedAt: entity.getUpdatedAt(),
          deletedAt: entity.getDeletedAt(),
        },
      });

      return right(entity);
    } catch (e) {
      return left(e);
    }
  }

  findByName(name: string): Promise<Either<Error, Category>> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Either<Error, Category>> {
    try {
      const check = await this.model.findUnique({
        where: {
          id: id,
        },
      });

      if (!check) {
        return left(new RepositoryException(`Category not found ${id}`, 404));
      }

      return right(Category.createFrom({ ...check, updatedAt: new Date() }));
    } catch (e) {
      return left(e);
    }
  }

  delete(id: string): Promise<Either<Error, void>> {
    throw new Error('Method not implemented.');
  }
  update(entity: Category): Promise<Either<Error, Category>> {
    throw new Error('Method not implemented.');
  }
  list(): Promise<Either<Error, Category[]>> {
    throw new Error('Method not implemented.');
  }
}
