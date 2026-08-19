import type { Book } from 'generated/prisma/client';

export interface LLMService {
  generateSuggestionsText(loanedBooks: Book[], candidateBooks: Book[]): Promise<string>;
  generateSuggestionsFromQuery(query: string, candidateBooks: Book[]): Promise<string>;
  generateFreeChatResponse(message: string): Promise<string>;
}
