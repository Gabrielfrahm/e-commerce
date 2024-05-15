/* eslint-disable @typescript-eslint/no-unused-vars */
import { Either, left, right } from '@common/utils/either';
import { Category } from '../entities/categories.entity';
import { CategoryRepositoryInterface } from '../interfaces/category.repository';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { RepositoryException } from '@common/exceptions/repository.exception';
import { SearchCategoriesDto } from '../dtos/category/search-categories.dto';
import { Search } from '@common/interfaces/search.interface';

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
          id: entity.getId(),
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

      return right(Category.createFrom(check));
    } catch (e) {
      return left(e);
    }
  }

  async delete(id: string): Promise<Either<Error, void>> {
    try {
      const check = await this.model.findUnique({
        where: {
          id: id,
        },
      });

      if (!check) {
        return left(new RepositoryException(`category not found: ${id}`, 404));
      }

      await this.model.delete({
        where: {
          id: id,
        },
      });

      return right(null);
    } catch (e) {
      return left(e);
    }
  }

  async update(entity: Category): Promise<Either<Error, Category>> {
    try {
      const check = await this.model.findUnique({
        where: {
          name: entity.getName(),
        },
      });

      if (check && check.id !== entity.getId()) {
        return left(
          new RepositoryException(
            `category name already existi: ${entity.getName()}`,
            409,
          ),
        );
      }

      const updateCategory = await this.model.update({
        where: {
          id: entity.getId(),
        },
        data: {
          name: entity.getName(),
          parentCategoryId: entity.getParentCategoryId(),
          updatedAt: entity.getUpdatedAt(),
        },
      });

      return right(Category.createFrom(updateCategory));
    } catch (e) {
      return left(e);
    }
  }

  async list({
    page = 1,
    perPage = 10,
    name,
    parentName,
    sort,
    sortDir,
  }: SearchCategoriesDto): Promise<Either<Error, Search<Category>>> {
    const skip = (page - 1) * perPage;
    const take = perPage;
    console.log(skip);
    try {
      const categories = await this.model.findMany({
        where: {
          deletedAt: null,
          ...(name && {
            name: {
              mode: 'insensitive',
              contains: name,
            },
          }),
          ...(parentName && {
            category: {
              name: {
                mode: 'insensitive',
                contains: parentName,
              },
            },
          }),
        },
        orderBy: {
          [sort ?? 'createdAt']: sortDir ?? 'desc',
        },
        skip: skip,
        take: take,
      });

      const count = await this.model.count({
        where: {
          deletedAt: null,
          ...(name && {
            name: {
              mode: 'insensitive',
              contains: name,
            },
          }),
          ...(parentName && {
            category: {
              name: {
                mode: 'insensitive',
                contains: parentName,
              },
            },
          }),
        },
      });

      const lastPage = Math.ceil(count / take);

      return right({
        data: categories.map((category) => Category.createFrom(category)),
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
