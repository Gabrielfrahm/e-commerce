import { Either, left, right } from '@common/utils/either';
import { CryptoInterface } from '../interfaces/crypto.interface';
import { compareSync, hashSync } from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { ServiceException } from '@common/exceptions/service.exception';

@Injectable()
export class CryptoService implements CryptoInterface {
  private salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<Either<Error, string>> {
    try {
      const hashedValue = hashSync(value, this.salt);
      return right(hashedValue);
    } catch (e) {
      return left(
        new ServiceException('Erro ao realizar o hash do valor', 500),
      );
    }
  }

  async compare(
    value: string,
    hashedValue: string,
  ): Promise<Either<Error, boolean>> {
    try {
      const isValid = compareSync(value, hashedValue);

      return right(isValid);
    } catch (e) {
      return left(new ServiceException('erro ao comparar valores', 500));
    }
  }
}
