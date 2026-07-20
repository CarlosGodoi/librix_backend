import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';
import { PrismaClient } from 'generated/prisma/client';

const prismaAdapter = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const prisma = prismaAdapter;

async function userSeed() {
  const Admin = await prisma.user.upsert({
    where: {
      email: 'admin@librix.com',
    },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@librix.com',
      phone: '55 99988-9809',
      profile: 'ADMIN',
      situation: 'ACTIVE',
      password: await hash('Test@123', 8),
      createdAt: new Date(),
    },
  });
  const Visitante = await prisma.user.upsert({
    where: {
      email: 'visitante@librix.com',
    },
    update: {},
    create: {
      name: 'Visitante',
      email: 'visitante@librix.com',
      phone: '55 98765-8976',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: await hash('Visitante@123', 8),
      createdAt: new Date(),
    },
  });
  const Bibliotecario = await prisma.user.upsert({
    where: {
      email: 'bibliotecario@librix.com',
    },
    update: {},
    create: {
      name: 'Administrador',
      email: 'bibliotecario@librix.com',
      phone: '55 99743-3328',
      profile: 'LIBRARIAN',
      situation: 'ACTIVE',
      password: await hash('Bibliotecario@123', 8),
      createdAt: new Date(),
    },
  });

  console.log({ 'Admin =>': Admin, 'Visitante =>': Visitante, 'Bibliotecario =>': Bibliotecario });
}

async function main() {
  try {
    await userSeed();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
