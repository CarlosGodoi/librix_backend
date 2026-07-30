// src/use-cases/books/get-book-recommendations.ts
import type { BooksRepository } from '@/repositories/books-repository';
import type { LoansRepository } from '@/repositories/loans-repository';
import { cosineSimilarity, type EmbeddingService } from '@/services/embedding/embedding-service';
import type { LLMService } from '@/services/llm/llm-service';
import type { Book } from 'generated/prisma/client';

interface GetBookRecommendationsUseCaseRequest {
  userId: string;
}

interface GetBookRecommendationsUseCaseResponse {
  baseadoEm: string[];
  sugestoes: Book[];
  explicacao: string;
}

function buildEmbeddingText(book: Book): string {
  return `${book.title}. Gênero: ${book.category}. ${book.synopsis ?? ''}`;
}

export class GetBookRecommendationsUseCase {
  constructor(
    private booksRepository: BooksRepository,
    private loansRepository: LoansRepository,
    private embeddingService: EmbeddingService,
    private llmService: LLMService,
  ) {}

  async execute({
    userId,
  }: GetBookRecommendationsUseCaseRequest): Promise<GetBookRecommendationsUseCaseResponse> {
    const { loans: recentLoans } = await this.loansRepository.findByUserId(userId, {
      skip: 1,
      take: 5,
    });

    if (recentLoans.length === 0) {
      return {
        baseadoEm: [],
        sugestoes: [],
        explicacao: 'Usuário ainda não possui empréstimos suficientes.',
      };
    }

    const loanedBookIds = recentLoans.map((loan) => loan.bookId);
    const loanedBooks = await this.booksRepository.findManyByIds(loanedBookIds);

    const userProfileText = loanedBooks.map(buildEmbeddingText).join(' | ');
    const userEmbedding = await this.embeddingService.getEmbedding(userProfileText);

    // já vem só com quem tem embedding calculado
    const booksWithEmbedding = await this.booksRepository.findManyWithEmbedding();
    const candidates = booksWithEmbedding.filter((book) => !loanedBookIds.includes(book.id));

    const scored = candidates.map((book) => ({
      book,
      score: cosineSimilarity(userEmbedding, book.embedding as unknown as number[]),
    }));

    const topCandidates = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.book);

    const explicacao = await this.llmService.generateSuggestionText(loanedBooks, topCandidates);

    return {
      baseadoEm: loanedBooks.map((b) => b.title),
      sugestoes: topCandidates,
      explicacao,
    };
  }
}
