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
}
