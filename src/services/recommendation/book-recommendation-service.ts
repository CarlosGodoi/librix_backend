import type { BooksRepository } from '@/repositories/books-repository';
import type { LoansRepository } from '@/repositories/loans-repository';
import { cosineSimilarity, type EmbeddingService } from '../embedding/embedding-service';
import type { Book } from 'generated/prisma/client';
import type { FindSimilarOptions, RecommendationService } from './recommendation-service';
import normalize from '@/utils/normalize';

function buildEmbeddingText(book: Book): string {
  return `Livro do gênero ${book.category}. Categoria: ${book.category}. Título: ${book.title}. ${book.synopsis ?? ''}`;
}

export class BookRecommendationService implements RecommendationService {
  constructor(
    private booksRepository: BooksRepository,
    private loansRepository: LoansRepository,
    private embeddingService: EmbeddingService,
  ) {}

  async getLoanedBooks(userId: string, take = 5): Promise<Book[]> {
    const { loans } = await this.loansRepository.findByUserId(userId, { skip: 0, take });
    if (loans.length === 0) return [];

    const loanedBookIds = loans.map((loan) => loan.bookId);
    return this.booksRepository.findManyByIds(loanedBookIds);
  }

  async findSimilarByHistory(userId: string, limit = 3): Promise<Book[]> {
    const loanedBooks = await this.getLoanedBooks(userId);
    if (loanedBooks.length === 0) return [];

    const userProfileText = loanedBooks.map(buildEmbeddingText).join(' | ');
    const userEmbedding = await this.embeddingService.getEmbedding(userProfileText);

    return this.findSimilarByVector(userEmbedding, {
      excludeIds: loanedBooks.map((b) => b.id),
      limit,
    });
  }

  async findSimilarByVector(vector: number[], options?: FindSimilarOptions): Promise<Book[]> {
    const booksWithEmbedding = await this.booksRepository.findManyWithEmbedding();

    const candidates = booksWithEmbedding.filter((book) => !options?.excludeIds?.includes(book.id));

    const CATEGORY_BOOST = 0.35; // ajuste empírico

    const scored = candidates.map((book) => {
      const semanticScore = cosineSimilarity(vector, book.embedding as unknown as number[]);
      const categoryMatch =
        options?.category && normalize(book.category) === normalize(options.category);

      return {
        book,
        score: categoryMatch ? semanticScore + CATEGORY_BOOST : semanticScore,
      };
    });

    const MIN_SIMILARITY_THRESHOLD = 0.35;

    return scored
      .filter((s) => s.score >= MIN_SIMILARITY_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, options?.limit ?? 3)
      .map((s) => s.book);
  }
}
