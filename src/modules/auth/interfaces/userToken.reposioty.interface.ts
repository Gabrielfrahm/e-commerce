import { Either } from '@common/utils/either';

export interface UserTokenRepositoryInterface {
  create(token: string, userId: string): Promise<Either<Error, unknown>>;
}
