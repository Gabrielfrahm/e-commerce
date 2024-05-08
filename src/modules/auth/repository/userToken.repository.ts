import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserTokenRepositoryInterface } from '../interfaces/userToken.reposioty.interface';
import { Either, left, right } from '@common/utils/either';
import { RepositoryException } from '@common/exceptions/repository.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserTokenRepository implements UserTokenRepositoryInterface {
  private model: PrismaService['userToken'];
  constructor(prismaService: PrismaService) {
    this.model = prismaService.userToken;
  }

  async create(token: string, userId: string): Promise<Either<Error, unknown>> {
    try {
      const checkTokenUser = await this.model.findMany({
        where: {
          userId: userId,
        },
      });

      if (checkTokenUser.length > 0) {
        await this.model.deleteMany({
          where: {
            userId: userId,
          },
        });
      }

      const tokenCreated = await this.model.create({
        data: {
          token,
          userId,
        },
      });

      return right(tokenCreated);
    } catch (e) {
      return left(new RepositoryException(e.message, 500));
    }
  }
}
