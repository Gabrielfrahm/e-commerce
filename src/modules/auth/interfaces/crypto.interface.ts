import { Either } from '@common/utils/either';

export interface CryptoInterface {
  hash(value: string): Promise<Either<Error, string>>;
  compare(value: string, hashedValue: string): Promise<Either<Error, boolean>>;
}
