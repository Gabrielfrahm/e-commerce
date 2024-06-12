import { Either } from '@common/utils/either';
import { Card } from '../entities/card.entity';

export interface CardRepositoryInterface {
  create(entity: Card, userId: string): Promise<Either<Error, Card>>;
  delete(id: string): Promise<Either<Error, void>>;
  findOne(id: string): Promise<Either<Error, Card>>;
  findAll(id: string): Promise<Either<Error, Card[]>>;
  update(entity: Card): Promise<Either<Error, Card>>;
}
