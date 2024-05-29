import { Injectable } from '@nestjs/common';
import { AttributesRepositoryInterface } from '../interfaces/attributes.repository';
import { Either, left, right } from '@common/utils/either';
import { ProductsAttributes } from '../entities/products-attributes.entity';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { RepositoryException } from '@common/exceptions/repository.exception';

@Injectable()
export class AttributesRepository implements AttributesRepositoryInterface {
  private model: PrismaService['productAttributes'];
  constructor(prismaService: PrismaService) {
    this.model = prismaService.productAttributes;
  }
  async findByName(name: string): Promise<Either<Error, ProductsAttributes>> {
    try {
      const check = await this.model.findFirst({
        where: {
          name: name,
        },
      });

      if (!check) {
        return left(
          new RepositoryException(`attribute not found: ${name}`, 404),
        );
      }

      return right(ProductsAttributes.CreateFrom(check));
    } catch (e) {
      return left(e);
    }
  }
}
