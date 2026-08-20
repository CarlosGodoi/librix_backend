// src/use-cases/books/factories/make-get-book-recommendations-use-case.ts
import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { PrismaLoansRepository } from '@/repositories/prisma/prisma-loans-repository';
import { HuggingFaceEmbeddingService } from '@/services/embedding/huggingface-embedding-service';
import { OpenRouterLLMService } from '@/services/llm/openrouter-llm-service';
import { BookRecommendationService } from '@/services/recommendation/book-recommendation-service';
import { GetBookRecommendationsUseCase } from '../books/getBookRecommendations';

export function makeGetBookRecommendationsUseCase() {
  const booksRepository = new PrismaBooksRepository();
  const loansRepository = new PrismaLoansRepository();
  const embeddingService = new HuggingFaceEmbeddingService();
  const llmService = new OpenRouterLLMService();
  const recommendationService = new BookRecommendationService(
    booksRepository,
    loansRepository,
    embeddingService,
  );
  const getBookRecommendationsUseCase = new GetBookRecommendationsUseCase(
    recommendationService,
    llmService,
  );

  return getBookRecommendationsUseCase;
}
