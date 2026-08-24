import type { Book } from 'generated/prisma/client';
import type { LLMService } from './llm-service';
import { callChatCompletion } from './openrouter-client';

export class OpenRouterLLMService implements LLMService {
  async generateSuggestionsText(loanedBooks: Book[], candidateBooks: Book[]): Promise<string> {
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
        const data = await callChatCompletion({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 800,
          reasoning: { effort: 'low' },
        });
        return data.choices[0].message.content;
      } catch (error) {
        if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') throw error;
        lastError = error;
        console.log(`Tentativa ${attempt} falhou, tentando novamente...`);
      }
    }

    throw lastError;
  }

  async generateSuggestionsFromQuery(query: string, candidateBooks: Book[]): Promise<string> {
    const prompt = `O usuário pediu: "${query}"

Livros candidatos encontrados (podem não ser exatamente do gênero pedido, mas são os mais próximos semanticamente disponíveis no acervo):
${candidateBooks.map((b) => `- ${b.title} (${b.category})`).join('\n')}

Se os livros não forem exatamente do gênero pedido, seja honesto sobre isso e explique a relação mais próxima encontrada. Responda em português, de forma breve e direta.
`;
    const maxRetries = 2;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const data = await callChatCompletion({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 500,
        });
        return data.choices[0].message.content;
      } catch (error) {
        lastError = error;
        console.log(`Tentativa ${attempt} falhou, tentando novamente...`);
      }
    }

    throw lastError;
  }

  async generateFreeChatResponse(message: string): Promise<string> {
    const systemPrompt = `
Você é o assistente de um sistema de biblioteca. Responda de forma breve e simpática, em português.
Se o usuário perguntar algo fora do escopo de livros/biblioteca, redirecione educadamente o assunto.
`;

    const maxRetries = 2;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const data = await callChatCompletion({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.5,
          max_tokens: 300,
        });
        return data.choices[0].message.content;
      } catch (error) {
        lastError = error;
        console.log(`Tentativa ${attempt} falhou, tentando novamente...`);
      }
    }

    throw lastError;
  }
}
