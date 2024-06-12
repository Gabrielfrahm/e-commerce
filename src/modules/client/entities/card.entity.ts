import { BaseEntity, BaseEntityProps } from '@common/utils/base.entity';
import { randomUUID } from 'crypto';

export interface CardProps extends BaseEntityProps {
  title: string;
  number: string;
  cardHolderName: string;
  year: number;
  month: number;
  code: string;
}

export class Card extends BaseEntity {
  private title: CardProps['title'];
  private number: CardProps['number'];
  private cardHolderName: CardProps['cardHolderName'];
  private year: CardProps['year'];
  private month: CardProps['month'];
  private code: CardProps['code'];

  constructor(data: CardProps) {
    super(data);
  }

  static CreateNew(
    data: Omit<CardProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    id = randomUUID(),
  ): Card {
    return new Card({
      id: id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static CreateFrom(data: CardProps): Card {
    return new Card({
      id: data.id,
      cardHolderName: data.cardHolderName,
      code: data.code,
      month: data.month,
      number: data.number,
      title: data.title,
      year: data.year,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      cardHolderName: this.cardHolderName,
      code: this.code,
      month: this.month,
      number: this.number,
      title: this.title,
      year: this.year,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  update(data: Partial<CardProps>): void {
    if (data.cardHolderName) {
      this.cardHolderName = data.cardHolderName;
    }

    if (data.code) {
      this.code = data.code;
    }

    if (data.month) {
      this.month = data.month;
    }

    if (data.year) {
      this.year = data.year;
    }

    if (data.number) {
      this.number = data.number;
    }

    if (data.title) {
      this.title = data.title;
    }

    this.updatedAt = new Date();
  }

  public getTitle(): string {
    return this.title;
  }

  public getNumber(): string {
    return this.number;
  }

  public getCardHolderName(): string {
    return this.cardHolderName;
  }

  public getYear(): number {
    return this.year;
  }

  public getMonth(): number {
    return this.month;
  }

  public getCode(): string {
    return this.code;
  }
}
