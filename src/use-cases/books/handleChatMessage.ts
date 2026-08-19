// src/use-cases/chat/handle-chat-message.ts
import type { IntentService } from '@/services/intent/intent-service';
import { type EmbeddingService } from '@/services/embedding/embedding-service';
import type { RecommendationService } from '@/services/recommendation/recommendation-service';
import type { LLMService } from '@/services/llm/llm-service';

interface HandleChatMessageUseCaseRequest {
  userId: string;
  message: string;
}

interface HandleChatMessageUseCaseResponse {
  reply: string;
}

export class HandleChatMessageUseCase {
  constructor(
    private intentService: IntentService,
    private embeddingService: EmbeddingService,
    private recommendationService: RecommendationService,
    private llmService: LLMService,
  ) {}

  async execute({
    userId,
    message,
  }: HandleChatMessageUseCaseRequest): Promise<HandleChatMessageUseCaseResponse> {
    try {
      const intent = await this.intentService.classify(message);

      switch (intent.type) {
        case 'recommend_by_history': {
          const loanedBooks = await this.recommendationService.getLoanedBooks(userId);
          if (loanedBooks.length === 0) {
            return {
              reply:
                'Você ainda não possui empréstimos suficientes para eu recomendar algo personalizado.',
            };
          }
          const candidates = await this.recommendationService.findSimilarByHistory(userId);
          const reply = await this.llmService.generateSuggestionsText(loanedBooks, candidates);
          return { reply };
        }

        case 'recommend_by_query': {
          const category = intent.category ?? '';
          const searchText = category
            ? `Livro do gênero ${category}. Categoria literária: ${category}. Busca: ${intent.query}`
            : intent.query;

          const queryVector = await this.embeddingService.embedText(searchText);
          const candidates = await this.recommendationService.findSimilarByVector(queryVector, {
            category: intent.category,
            limit: 3,
          });
          if (candidates.length === 0) {
            return {
              reply: `Não encontrei livros de ${intent.category ?? 'acordo com esse pedido'} no nosso acervo.`,
            };
          }
          const reply = await this.llmService.generateSuggestionsFromQuery(
            intent.query,
            candidates,
          );
          return { reply };
        }

        case 'chat':
        default: {
          const reply = await this.llmService.generateFreeChatResponse(message);
          return { reply };
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
        return {
          reply:
            'No momento estou recebendo muitas solicitações. Tente novamente em alguns minutos.',
        };
      }
      throw error;
    }
  }
}
