import axios from 'axios';
import type { ChatIntent, IntentService } from './intent-service';

export class OpenRouterIntentService implements IntentService {
  async classify(userMessage: string): Promise<ChatIntent> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    const systemPrompt = `
Você é um classificador de intenção para um chat de recomendação de livros.
Classifique a mensagem do usuário em UM dos tipos abaixo e responda APENAS com JSON válido, sem markdown:

1. { "type": "recommend_by_history" } -> usuário pede recomendação genérica, sem especificar tema/gênero (ex: "me indique um livro", "o que você recomenda pra mim?")
2. { "type": "recommend_by_query", "query": "<texto resumindo o pedido>", "category": "<gênero/categoria se identificável, senão null>" } -> usuário especifica gênero, tema, autor, mood (ex: "quero algo de ficção científica", "um livro leve pra viajar")
3. { "type": "chat", "message": "<mensagem original>" } -> qualquer outra coisa (perguntas gerais, conversa, dúvidas sobre o sistema)
`;

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: process.env.OPENROUTER_MODEL ?? 'openai/gpt-oss-20b:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0,
          max_tokens: 400,
          response_format: { type: 'json_object' },
          reasoning: { effort: 'low' },
        },
        { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 30000 },
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        console.log('Rate limit atingido no OpenRouter (intent).');
        throw new Error('RATE_LIMIT_EXCEEDED', { cause: error });
      }
      // fallback seguro se o parse falhar ou outro erro acontecer
      console.log('Falha ao classificar intenção, usando fallback "chat".');
      return { type: 'chat', message: userMessage };
    }
  }
}
