import type { Book } from 'generated/prisma/client';

export interface LLMService {
  generateSuggestionText(loanedBooks: Book[], candidateBooks: Book[]): Promise<string>;
}
