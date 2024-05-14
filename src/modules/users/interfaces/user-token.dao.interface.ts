import { Either } from '@common/utils/either';
import {
  CreateUserCodeDto,
  OutputUserCodeDto,
} from '../dtos/create-user-code.dto';

export interface UserCodeDAOInterface {
  createCode(
    code: CreateUserCodeDto,
  ): Promise<Either<Error, OutputUserCodeDto>>;
  findCode(code: number): Promise<Either<Error, OutputUserCodeDto>>;
  deleteCode(code: number): Promise<Either<Error, void>>;
}
