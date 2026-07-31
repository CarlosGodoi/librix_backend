import type { Book } from 'generated/prisma/client';

export interface LLMService {
  generateSuggestionsText(loanedBooks: Book[], candidateBooks: Book[]): Promise<string>;
}
