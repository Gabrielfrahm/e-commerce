import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export const seed = async (): Promise<void> => {
  await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'admin',
      type: 'admin',
      password: await hash('123456', 12),
    },
  });
};

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
