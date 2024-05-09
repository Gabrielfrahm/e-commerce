import { PrismaService } from '@modules/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { User } from '../entities/user.entity';
import { Either, left, right } from '@common/utils/either';
import { RepositoryException } from '@common/exceptions/repository.exception';

export enum Types {
  admin = 'admin',
  client = 'client',
  employer = 'employer',
}

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  private model: PrismaService['user'];

  constructor(prismaService: PrismaService) {
    this.model = prismaService.user;
  }

  async findByEmail(email: string): Promise<Either<Error, User>> {
    try {
      const userModel = await this.model.findUnique({
        where: {
          email: email,
        },
      });

      if (!userModel) {
        return left(new RepositoryException(`User not found ${email}`, 404));
      }

      return right(
        User.createFrom({
          ...userModel,
          type: Types[userModel.type],
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async createClient(email: string): Promise<Either<Error, User>> {
    try {
      const checkEmil = await this.model.findUnique({
        where: {
          email: email,
        },
      });

      if (checkEmil) {
        return left(
          new RepositoryException(
            `User Already existing with email: ${email}`,
            404,
          ),
        );
      }

      const createUser = await this.model.create({
        data: {
          email: email,
          type: 'client',
        },
      });

      return right(
        User.createFrom({
          ...createUser,
          type: Types[createUser.type],
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async createEmployer(entity: User): Promise<Either<Error, User>> {
    try {
      const checkEmil = await this.model.findUnique({
        where: {
          email: entity.getEmail(),
        },
      });

      if (checkEmil) {
        return left(
          new RepositoryException(
            `User Already existing with email: ${entity.getEmail()}`,
            404,
          ),
        );
      }

      const createUser = await this.model.create({
        data: {
          id: entity.getId(),
          email: entity.getEmail(),
          name: entity.getName(),
          type: entity.getType(),
          password: entity.getPassword(),
          createdAt: entity.getCreatedAt(),
          updatedAt: entity.getUpdatedAt(),
          deletedAt: entity.getDeletedAt(),
        },
      });

      return right(
        User.createFrom({
          ...createUser,
          type: Types[createUser.type],
        }),
      );
    } catch (e) {
      return left(e);
    }
  }
}
