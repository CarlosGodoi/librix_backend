import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { HuggingFaceEmbeddingService } from '@/services/embedding/huggingface-embedding-service';
import type { Book } from 'generated/prisma/client';

function buildEmbeddingText(book: Book): string {
  return `${book.title}. Gênero: ${book.category}. ${book.synopsis ?? ''}`;
}

async function backfill() {
  const booksRepository = new PrismaBooksRepository();
  const embeddingService = new HuggingFaceEmbeddingService();

  const books = await booksRepository.findManyWithoutEmbedding();
  console.log(`Processando ${books.length} livros sem embedding...`);

  for (const book of books) {
    try {
      const texto = buildEmbeddingText(book);
      const embedding = await embeddingService.getEmbedding(texto);
      await booksRepository.updateEmbedding(book.id, embedding);
      console.log(`✓ ${book.title}`);
    } catch (error) {
      console.error(`✗ Erro ao processar "${book.title}":`, error);
    }

    // evita rate limit da HuggingFace
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('Backfill concluído.');
  process.exit(0);
}

backfill().catch((error) => {
  console.error('Erro no backfill:', error);
  process.exit(1);
});
