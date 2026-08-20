import { describe, it, beforeEach, expect, vi } from 'vitest';
import { GetBookRecommendationsUseCase } from '../getBookRecommendations';
import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { InMemoryLoansRepository } from '@/repositories/in-memory/in-memory-loans-repository';
import type { BooksRepository } from '@/repositories/books-repository';
import type { LoansRepository } from '@/repositories/loans-repository';
import type { RecommendationService } from '@/services/recommendation/recommendation-service';
import type { LLMService } from '@/services/llm/llm-service';
import { BookRecommendationService } from '@/services/recommendation/book-recommendation-service';
import type { EmbeddingService } from '@/services/embedding/embedding-service';

let booksRepository: BooksRepository;
let loansRepository: LoansRepository;
let sut: GetBookRecommendationsUseCase;
let recommendationService: RecommendationService;
let llmService: LLMService;

describe('Get Book Recommendations Use Case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();
    loansRepository = new InMemoryLoansRepository();

    const embeddingService: EmbeddingService = {
      getEmbedding: vi.fn().mockResolvedValue([1, 0, 0]),
      embedText: vi.fn().mockResolvedValue([1, 0, 0]),
    };

    recommendationService = new BookRecommendationService(
      booksRepository,
      loansRepository,
      embeddingService,
    );
    llmService = {
      generateSuggestionsText: vi.fn().mockResolvedValue('Sugestões baseadas no seu histórico.'),
      generateSuggestionsFromQuery: vi.fn(),
      generateFreeChatResponse: vi.fn(),
    };

    sut = new GetBookRecommendationsUseCase(recommendationService, llmService);
  });

  it('Should return empty suggestions if the user has no loans.', async () => {
    const result = await sut.execute({ userId: 'user-01' });

    expect(result.sugestoes).toEqual([]);
    expect(result.explicacao).toContain('não possui empréstimos');
  });

  it('deve recomendar livros do mesmo gênero com base em 1 único empréstimo', async () => {
    // Arrange: cria 3 livros, 2 de ficção e 1 de romance
    const livroFiccao1 = await booksRepository.create({
      title: 'Duna',
      author: 'Author 3',
      isbn: 'ISBN 777-777-77-00-7',
      publisher: 'Editora 2',
      category: 'Ficção Científica',
      year: new Date(),
      copies: 9,
      synopsis: 'Uma saga espacial',
      coverUrl: '',
    });
    const livroFiccao2 = await booksRepository.create({
      title: 'Fundação',
      author: 'Author 2',
      isbn: 'ISBN 888-888-88-00-6',
      publisher: 'Editora 2',
      category: 'Ficção Científica',
      year: new Date(),
      copies: 5,
      synopsis: 'Império galático em colapso',
      coverUrl: '',
    });
    const livroRomance = await booksRepository.create({
      title: 'Orgulho e Preconceito',
      author: 'Author 1',
      isbn: 'ISBN 999-999-99-00-5',
      publisher: 'Editora 1',
      category: 'Romance',
      year: new Date(),
      copies: 2,
      synopsis: 'Uma história de amor',
      coverUrl: '',
    });

    // simula que já rodou o backfill/create hook de embedding
    await booksRepository.updateEmbedding(livroFiccao1.id, [1, 0, 0]);
    await booksRepository.updateEmbedding(livroFiccao2.id, [1, 0, 0]);
    await booksRepository.updateEmbedding(livroRomance.id, [0, 1, 0]);

    // Cria 1 ÚNICO empréstimo do livro de ficção
    await loansRepository.create({
      userId: 'user-01',
      bookId: livroFiccao1.id,
      loanDate: new Date(),
      dueDate: '09/08/2026',
      returnDate: '09/08/2026',
      status: 'INPROGRESS',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const result = await sut.execute({ userId: 'user-01' });

    expect(result.sugestoes).toHaveLength(1);
    expect(result.sugestoes[0].title).toBe('Fundação');
  });
});
