import { Either, left, right } from '@common/utils/either';
import {
  CreateUserCodeDto,
  OutputUserCodeDto,
} from '../dtos/create-user-code.dto';
import { UserCodeDAOInterface } from '../interfaces/user-token.dao.interface';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { randomInt } from 'crypto';

export class UserCodeDAO implements UserCodeDAOInterface {
  private model: PrismaService['userCode'];

  constructor(prismaService: PrismaService) {
    this.model = prismaService.userCode;
  }

  async createCode(
    command: CreateUserCodeDto,
  ): Promise<Either<Error, OutputUserCodeDto>> {
    try {
      const checkCodeByUser = await this.model.findFirst({
        where: { userId: command.userId },
      });

      if (checkCodeByUser) {
        return right(checkCodeByUser);
      }

      let unique = false;
      let code;

      while (!unique) {
        code = randomInt(100000, 999999);
        const checkCode = await this.model.findFirst({
          where: { code: code },
        });

        if (!checkCode) {
          unique = true;
        }
      }

      const createCode = await this.model.create({
        data: {
          code: command.code,
          userId: command.userId,
        },
      });

      return right(createCode);
    } catch (e) {
      return left(e);
    }
  }
}
