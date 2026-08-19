import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { PrismaLoansRepository } from '@/repositories/prisma/prisma-loans-repository';
import { HuggingFaceEmbeddingService } from '@/services/embedding/huggingface-embedding-service';
import { BookRecommendationService } from '@/services/recommendation/book-recommendation-service';
import { OpenRouterIntentService } from '@/services/intent/openrouter-intent-service';
import { OpenRouterLLMService } from '@/services/llm/openrouter-llm-service';
import { HandleChatMessageUseCase } from '@/use-cases/books/handleChatMessage';

export function makeHandleChatMessageUseCase() {
  const booksRepository = new PrismaBooksRepository();
  const loansRepository = new PrismaLoansRepository();
  const embeddingService = new HuggingFaceEmbeddingService();

  const recommendationService = new BookRecommendationService(
    booksRepository,
    loansRepository,
    embeddingService,
  );

  const intentService = new OpenRouterIntentService();
  const llmService = new OpenRouterLLMService();

  const handleChatMessageUseCase = new HandleChatMessageUseCase(
    intentService,
    embeddingService,
    recommendationService,
    llmService,
  );

  return handleChatMessageUseCase;
}
