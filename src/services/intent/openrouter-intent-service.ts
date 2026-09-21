import { callChatCompletion } from '../llm/openrouter-client';
import type { ChatIntent, IntentService } from './intent-service';

const VALID_TYPES = ['recommend_by_history', 'recommend_by_query', 'chat'];

export class OpenRouterIntentService implements IntentService {
  async classify(userMessage: string): Promise<ChatIntent> {
    const systemPrompt = `
Você é um classificador de intenção para um chat de recomendação de livros.
Classifique a mensagem do usuário em UM dos tipos abaixo e responda APENAS com JSON válido, sem markdown:

1. { "type": "recommend_by_history" } -> usuário pede recomendação genérica ou baseada no que já leu/emprestou, sem especificar tema/gênero novo. Exemplos: "me indique um livro", "o que você recomenda pra mim?", "sugira livros com base nas minhas últimas leituras", "quero descobrir uma nova leitura", "com base no meu histórico, o que ler?", "me surpreenda"

2. { "type": "recommend_by_query", "query": "<texto resumindo o pedido>", "category": "<gênero/categoria se identificável, senão null>" } -> usuário especifica gênero, tema, autor, mood (ex: "quero algo de ficção científica", "um livro leve pra viajar")

3. { "type": "chat", "message": "<mensagem original>" } -> qualquer outra coisa (perguntas gerais, conversa, dúvidas sobre o sistema)

Responda "recommend_by_history" sempre que o pedido mencionar "últimas leituras", "histórico", "o que já li", "baseado em mim" ou for um pedido vago de recomendação sem tema específico.
`;

    try {
      const data = await callChatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0,
        max_tokens: 400,
        response_format: { type: 'json_object' },
        reasoning: { effort: 'low' },
      });

      const rawContent: string = data.choices[0].message.content ?? '';

      // alguns modelos ignoram "sem markdown" e mandam ```json ... ```
      const cleaned = rawContent
        .trim()
        .replace(/^```(json)?/i, '')
        .replace(/```$/, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      if (!parsed || typeof parsed !== 'object' || !VALID_TYPES.includes(parsed.type)) {
        throw new Error(`Formato de intenção inválido: ${cleaned}`);
      }

      return parsed as ChatIntent;
    } catch (error) {
      if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') throw error;
      console.log('Falha ao classificar intenção, usando fallback "chat".', error);
      return { type: 'chat', message: userMessage };
    }
  }
}
