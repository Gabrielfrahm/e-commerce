import { BaseEntity } from '@common/utils/base.entity';

export class Products extends BaseEntity {
  constructor(data) {
    super(data);
  }

  serialize(): Record<string, unknown> {
    throw new Error('Method not implemented.');
  }
}
