import { Either, left, right } from '@common/utils/either';
import { JwtInterface } from '../interfaces/jwt.interface';
import { sign, verify } from 'jsonwebtoken';
import { ServiceException } from '@common/exceptions/service.exception';
import { Injectable } from '@nestjs/common';

interface UserJwtPayload {
  id: string;
  type: string;
}

@Injectable()
export class JwtService implements JwtInterface {
  async generateToken(
    payload: UserJwtPayload,
    expiresIn: string | number,
  ): Promise<Either<Error, string>> {
    try {
      const token = sign(payload, '123456', { expiresIn });
      return right(token);
    } catch (e) {
      return left(new ServiceException('Erro ao gerar token.', 500));
    }
  }

  async verifyToken(token: string): Promise<Either<Error, unknown>> {
    try {
      const isValid = verify(token, '123456');

      return right(isValid);
    } catch (e) {
      return left(new ServiceException('Error ao verificar token', 500));
    }
  }
}
