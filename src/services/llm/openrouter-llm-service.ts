import axios from 'axios';
import type { Book } from 'generated/prisma/client';
import type { LLMService } from './llm-service';

export class OpenRouterLLMService implements LLMService {
  async generateSuggestionsText(loanedBooks: Book[], candidateBooks: Book[]): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    const prompt = `
Histórico do usuário (últimos livros lidos):
${loanedBooks.map((b) => `- ${b.title} (${b.category})`).join('\n')}

Livros candidatos para recomendação:
${candidateBooks.map((b) => `- ${b.title} (${b.category})`).join('\n')}

Explique brevemente, em português, por que esses livros candidatos combinam com o perfil de leitura do usuário.
`;

    const maxRetries = 2;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: process.env.OPENROUTER_MODEL ?? 'openai/gpt-oss-20b:free',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 300,
          },
          {
            headers: { Authorization: `Bearer ${apiKey}` },
            timeout: 60000,
          },
        );
        return response.data.choices[0].message.content;
      } catch (error) {
        lastError = error;
        console.log(`Tentativa ${attempt} falhou, tentando novamente...`);
      }
    }

    throw lastError;
  }
}
