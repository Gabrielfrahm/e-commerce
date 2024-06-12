/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CardRepositoryInterface } from '../interfaces/card.repository';
import { Either, left, right } from '@common/utils/either';
import { Card } from '../entities/card.entity';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { RepositoryException } from '@common/exceptions/repository.exception';

@Injectable()
export class CardRepository implements CardRepositoryInterface {
  private model: PrismaService['card'];
  constructor(prismaService: PrismaService) {
    this.model = prismaService.card;
  }

  async create(entity: Card, userId: string): Promise<Either<Error, Card>> {
    try {
      const card = await this.model.findFirst({
        where: {
          title: entity.getTitle(),
          userId: userId,
        },
      });

      if (card) {
        return left(new RepositoryException(`card already exist`, 409));
      }

      await this.model.create({
        data: {
          id: entity.getId(),
          cardHolderName: entity.getCardHolderName(),
          code: entity.getCode(),
          month: entity.getMonth(),
          number: entity.getNumber(),
          title: entity.getTitle(),
          year: entity.getYear(),
          userId: userId,
        },
      });

      return right(entity);
    } catch (e) {
      return left(e);
    }
  }

  async delete(id: string): Promise<Either<Error, void>> {
    try {
      const card = await this.model.findFirst({
        where: {
          id: id,
        },
      });

      if (!card) {
        return left(new RepositoryException(`card not found`, 404));
      }

      await this.model.delete({
        where: {
          id: id,
        },
      });

      return right(null);
    } catch (e) {
      return left(e);
    }
  }

  async findOne(id: string): Promise<Either<Error, Card>> {
    try {
      const card = await this.model.findUnique({
        where: {
          id: id,
        },
      });

      if (!card) {
        return left(new RepositoryException(`card not found`, 404));
      }

      return right(
        Card.CreateFrom({
          id: card.id,
          cardHolderName: card.cardHolderName,
          code: card.code,
          month: card.month,
          number: card.number,
          title: card.title,
          year: card.year,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async findAll(id: string): Promise<Either<Error, Card[]>> {
    try {
      const cards = await this.model.findMany({
        where: {
          userId: id,
        },
      });

      return right(
        cards.map((card) =>
          Card.CreateFrom({
            id: card.id,
            cardHolderName: card.cardHolderName,
            code: card.code,
            month: card.month,
            number: card.number,
            title: card.title,
            year: card.year,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          }),
        ),
      );
    } catch (e) {
      return left(e);
    }
  }

  async update(entity: Card): Promise<Either<Error, Card>> {
    try {
      const card = await this.model.update({
        where: {
          id: entity.getId(),
        },
        data: {
          cardHolderName: entity.getCardHolderName(),
          code: entity.getCode(),
          month: entity.getMonth(),
          number: entity.getNumber(),
          title: entity.getTitle(),
          year: entity.getYear(),
        },
      });

      return right(
        Card.CreateFrom({
          id: card.id,
          cardHolderName: card.cardHolderName,
          code: card.code,
          month: card.month,
          number: card.number,
          title: card.title,
          year: card.year,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        }),
      );
    } catch (e) {
      return left(e);
    }
  }
}
