import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export const seed = async (): Promise<void> => {
  const categories = [
    {
      id: 'a997db7c-da5b-49ce-beed-2f97f1e91f38',
      name: 'Informática',
      parentCategoryId: null,
    },
    {
      id: '1e457f9e-9c67-4c8b-a5db-b54fa30e3b1f',
      name: 'Periféricos',
      parentCategoryId: 'a997db7c-da5b-49ce-beed-2f97f1e91f38',
    },
    {
      id: 'a2e567d5-7b6a-4f8a-87b8-d5f40f4eabc6',
      name: 'Teclados',
      parentCategoryId: '1e457f9e-9c67-4c8b-a5db-b54fa30e3b1f',
    },
    {
      id: 'c8d3c1eb-3f6f-4eae-8f84-19b9b56b686f',
      name: 'Mecânicos',
      parentCategoryId: 'a2e567d5-7b6a-4f8a-87b8-d5f40f4eabc6',
    },
    {
      id: '5fb2f6d6-6f4c-4d59-bd8a-2b0d1f1b8d75',
      name: 'Membrana',
      parentCategoryId: 'a2e567d5-7b6a-4f8a-87b8-d5f40f4eabc6',
    },
    {
      id: '9b6dcd8c-3d4e-4e4f-8c84-6b4c5b1a6d3c',
      name: 'Mouses',
      parentCategoryId: '1e457f9e-9c67-4c8b-a5db-b54fa30e3b1f',
    },
    {
      id: '1d4b2c6a-2f7f-47c8-9d8a-5b5e8f7a6d4c',
      name: 'Ópticos',
      parentCategoryId: '9b6dcd8c-3d4e-4e4f-8c84-6b4c5b1a6d3c',
    },
    {
      id: '3e5d8f7b-4d6e-47d9-9e8f-7d4b2c1e5f6d',
      name: 'Laser',
      parentCategoryId: '9b6dcd8c-3d4e-4e4f-8c84-6b4c5b1a6d3c',
    },

    {
      id: '7c8e6d4a-2f7b-4e8a-8d6b-5b7d9c6e3f2a',
      name: 'Monitores',
      parentCategoryId: '1e457f9e-9c67-4c8b-a5db-b54fa30e3b1f',
    },
    {
      id: '9f5d4b3a-8e7d-4e9c-8f7d-2d4b6a5e3f1b',
      name: 'LED',
      parentCategoryId: '7c8e6d4a-2f7b-4e8a-8d6b-5b7d9c6e3f2a',
    },
    {
      id: '3f6e2d4b-8c5d-4e8a-9f6b-7e4c5a3d2f1b',
      name: 'LCD',
      parentCategoryId: '7c8e6d4a-2f7b-4e8a-8d6b-5b7d9c6e3f2a',
    },
    {
      id: '6d7f4e5a-2f8b-4c7e-8d6b-5b7c8a6e4d3f',
      name: 'Curvos',
      parentCategoryId: '7c8e6d4a-2f7b-4e8a-8d6b-5b7d9c6e3f2a',
    },
  ];

  const attributes = [
    { id: 'e9ff9e21-ca57-4f11-9b0a-9c53de0dcfad', name: 'Formato' },
    { id: '1860999d-dc30-432f-b51a-d3626fbaaefa', name: 'Tamanho' },
    { id: '16589585-e8c1-4a88-a25b-a064f3c2d918', name: 'Cor' },
    { id: '332cf092-548a-43ac-9292-0bd9ac232646', name: 'Material' },
    { id: '71f163d6-9dbb-4873-aae9-e8e2129e139c', name: 'Peso' },
    { id: 'f5d3437e-7ef9-4653-95e3-2bf25097ed9a', name: 'Dimensões' },
    { id: '9ba42ad7-c9f4-4b93-94c6-a344eecc4afa', name: 'Capacidade' },
    { id: '108ba855-f25e-4444-94c0-c8489f0f5bf6', name: 'Gênero' },
    { id: '7e3535d0-db66-42a7-aa41-d9af2b3a474e', name: 'Idade Recomendada' },
    { id: '88fec773-fe85-477a-9aed-51388661f38e', name: 'Compatibilidade' },
    { id: '2b7cdb22-3a73-4582-835f-60e3b12a2c4c', name: 'Energia' },
    { id: '6a429dd7-ac78-4fab-80fa-4668c587133f', name: 'Estilo' },
    { id: 'e9c844ed-85f6-41ea-baa4-95150a3347c3', name: 'Uso' },
    { id: '273423cc-9e96-4880-bd45-3b19e9bb2424', name: 'Marca' },
    { id: '8712301b-91d0-460c-954d-e81208d93fd1', name: 'Garantia' },
  ];

  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { email: 'admin@admin.com' },
      update: {},
      create: {
        email: 'admin@admin.com',
        name: 'admin',
        type: 'admin',
        password: await hash('123456', 12),
      },
    });
    await tx.user.upsert({
      where: { email: 'employer@mail.com' },
      update: {},
      create: {
        email: 'employer@mail.com',
        name: 'employer',
        type: 'employer',
        password: await hash('123456', 12),
      },
    });
    await tx.user.upsert({
      where: { email: 'client@mail.com' },
      update: {},
      create: {
        email: 'client@mail.com',
        name: 'client',
        type: 'client',
      },
    });
    for (const category of categories) {
      await tx.category.upsert({
        where: { id: category.id },
        update: {},
        create: {
          id: category.id,
          name: category.name,
          parentCategoryId: category.parentCategoryId,
        },
      });
    }
    for (const attribute of attributes) {
      await tx.productAttributes.upsert({
        where: { id: attribute.id },
        update: {},
        create: {
          id: attribute.id,
          name: attribute.name,
        },
      });
    }
  });
};

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
