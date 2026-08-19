import type { LLMService } from '@/services/llm/llm-service';
import type { RecommendationService } from '@/services/recommendation/recommendation-service';
import type { Book } from 'generated/prisma/client';

interface GetBookRecommendationsUseCaseRequest {
  userId: string;
}

interface GetBookRecommendationsUseCaseResponse {
  baseadoEm: string[];
  sugestoes: Book[];
  explicacao: string;
}

export class GetBookRecommendationsUseCase {
  constructor(
    private recommendationService: RecommendationService,
    private llmService: LLMService,
  ) {}

  async execute({
    userId,
  }: GetBookRecommendationsUseCaseRequest): Promise<GetBookRecommendationsUseCaseResponse> {
    const loanedBooks = await this.recommendationService.getLoanedBooks(userId);

    if (loanedBooks.length === 0) {
      return {
        baseadoEm: [],
        sugestoes: [],
        explicacao: 'Usuário ainda não possui empréstimos suficientes.',
      };
    }

    const topCandidates = await this.recommendationService.findSimilarByHistory(userId, 3);
    const explicacao = await this.llmService.generateSuggestionsText(loanedBooks, topCandidates);

    return {
      baseadoEm: loanedBooks.map((b) => b.title),
      sugestoes: topCandidates,
      explicacao,
    };
  }
}
