import { Either } from '../../../common/utils/either';

export interface JwtInterface {
  generateToken(
    payload: unknown,
    expiresIn: number | string,
  ): Promise<Either<Error, string>>;
  verifyToken(token: string): Promise<Either<Error, unknown>>;
}
