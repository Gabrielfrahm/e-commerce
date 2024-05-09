import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from 'src/common/utils/base.entity';

export interface UserProps extends BaseEntityProps {
  name?: string;
  email: string;
  password?: string;
  type: 'admin' | 'client' | 'employer';
}

export class User extends BaseEntity {
  private readonly name: UserProps['name'];
  private readonly email: UserProps['email'];
  private readonly password: UserProps['password'];
  private readonly type: UserProps['type'];

  constructor(data: UserProps) {
    super(data);
  }

  static createNew(
    data: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    id = randomUUID(),
  ): User {
    return new User({
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static createFrom(data: UserProps): User {
    return new User({
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      type: data.type,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string | undefined {
    return this.password;
  }

  getType(): string {
    return this.type;
  }
}
