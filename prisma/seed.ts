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
      password: await hash('Admin@123', 8),
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
      name: 'Bibliotecario',
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

async function booksSeed() {
  const books = await prisma.book.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        isbn: 'ISBN 978-123-45-67-8',
        publisher: 'Editora Garnier',
        category: 'Romance',
        year: new Date('1899'),
        copies: 8,
        synopsis:
          'Clássico da literatura brasileira que narra a história de Bentinho e Capitu, explorando temas como amor, ciúmes, memória e a subjetividade da verdade.',
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: 'ISBN 978-234-56-78-9',
        publisher: 'Secker & Warburg',
        category: 'Ficção Distópica',
        year: new Date('1949'),
        copies: 6,
        synopsis:
          'Em um regime totalitário onde tudo é monitorado, Winston Smith desafia o sistema em busca de liberdade e identidade.',
      },
      {
        title: 'Orgulho e Preconceito',
        author: 'Jane Austen',
        isbn: 'ISBN 978-345-67-89-0',
        publisher: 'T. Egerton',
        category: 'Romance',
        year: new Date('1813'),
        copies: 10,
        synopsis:
          'A história acompanha Elizabeth Bennet e o Sr. Darcy em uma jornada marcada por preconceitos, amadurecimento e descobertas sobre o amor.',
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: 'ISBN 978-456-78-90-1',
        publisher: 'Prentice Hall',
        category: 'Tecnologia',
        year: new Date('2008'),
        copies: 12,
        synopsis:
          'Obra de referência para desenvolvedores, apresentando princípios, práticas e padrões para escrever código limpo, legível e de fácil manutenção.',
      },
      {
        title: 'O Senhor dos Anéis: A Sociedade do Anel',
        author: 'J. R. R. Tolkien',
        isbn: 'ISBN 978-567-89-01-2',
        publisher: 'Allen & Unwin',
        category: 'Fantasia',
        year: new Date('1954'),
        copies: 7,
        synopsis:
          'Frodo Bolseiro inicia uma perigosa jornada para destruir o Um Anel e impedir que Sauron domine a Terra-média.',
      },
      {
        title: 'Sapiens: Uma Breve História da Humanidade',
        author: 'Yuval Noah Harari',
        isbn: 'ISBN 978-678-90-12-3',
        publisher: 'Harvill Secker',
        category: 'História',
        year: new Date('2011'),
        copies: 9,
        synopsis:
          'Uma análise da evolução da humanidade desde os primeiros hominídeos até a sociedade contemporânea, abordando cultura, economia e ciência.',
      },
      {
        title: 'A Garota no Trem',
        author: 'Paula Hawkins',
        isbn: 'ISBN 978-789-01-23-4',
        publisher: 'Doubleday',
        category: 'Suspense',
        year: new Date('2015'),
        copies: 5,
        synopsis:
          'Rachel observa diariamente a vida de um casal durante suas viagens de trem, até que um desaparecimento a coloca no centro de uma investigação.',
      },
      {
        title: 'O Pequeno Príncipe',
        author: 'Antoine de Saint-Exupéry',
        isbn: 'ISBN 978-890-12-34-5',
        publisher: 'Reynal & Hitchcock',
        category: 'Literatura Infantil',
        year: new Date('1943'),
        copies: 15,
        synopsis:
          'Um piloto perdido no deserto conhece um pequeno príncipe que compartilha reflexões profundas sobre amizade, amor e o sentido da vida.',
      },
      {
        title: 'O Andar do Bêbado',
        author: 'Leonard Mlodinow',
        isbn: 'ISBN 978-901-23-45-6',
        publisher: 'Pantheon Books',
        category: 'Ciência',
        year: new Date('2008'),
        copies: 4,
        synopsis:
          'O autor explica como o acaso influencia decisões, acontecimentos e resultados em diversas áreas da vida, muitas vezes mais do que imaginamos.',
      },
      {
        title: 'Hábitos Atômicos',
        author: 'James Clear',
        isbn: 'ISBN 978-912-34-56-7',
        publisher: 'Avery',
        category: 'Desenvolvimento Pessoal',
        year: new Date('2018'),
        copies: 11,
        synopsis:
          'O livro apresenta estratégias práticas para criar bons hábitos, eliminar comportamentos prejudiciais e alcançar melhorias consistentes ao longo do tempo.',
      },
    ],
  });

  console.log({ 'Books =>': books });
}

async function main() {
  try {
    await userSeed();
    await booksSeed();
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
