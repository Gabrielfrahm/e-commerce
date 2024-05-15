import { BaseEntity, BaseEntityProps } from '@common/utils/base.entity';
import { randomUUID } from 'crypto';

export interface CategoryEntityProps extends BaseEntityProps {
  name: string;
  parentCategoryId?: string;
}

export class Category extends BaseEntity {
  private name: CategoryEntityProps['name'];
  private parentCategoryId: CategoryEntityProps['parentCategoryId'];

  constructor(data: CategoryEntityProps) {
    super(data);
  }

  static CreateNew(
    data: Omit<
      CategoryEntityProps,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
    id = randomUUID(),
  ): Category {
    return new Category({
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static createFrom(data: CategoryEntityProps): Category {
    return new Category({
      id: data.id,
      name: data.name,
      parentCategoryId: data.parentCategoryId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      parentCategoryId: this.parentCategoryId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  getName(): string {
    return this.name;
  }

  getParentCategoryId(): string {
    return this.parentCategoryId;
  }

  setParentCategoryId(categoryId: string): void {
    this.parentCategoryId = categoryId;
    this.updatedAt = new Date();
  }

  setName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
