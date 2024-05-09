import { Either } from '@common/utils/either';
import { User } from '../entities/user.entity';

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<Either<Error, User>>;
  createClient(email: string): Promise<Either<Error, User>>;
}
