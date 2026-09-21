import axios, { type AxiosRequestConfig } from 'axios';

const FREE_MODELS_FALLBACK = [
  process.env.OPENROUTER_MODEL,
  'dots-studio/dots-3-note-preview:free',
  'poolside/laguna-s-2.1:free',
  'nvidia/nemotron-3.5-lightning:free',
].filter(Boolean) as string[];

interface ChatCompletionPayload {
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string };
  reasoning?: { effort: string };
}

export async function callChatCompletion(payload: ChatCompletionPayload) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${apiKey}` },
    timeout: 30000,
  };

  let lastError: unknown;
  let allRateLimited = true; // só vira false se algum erro NÃO for 429

  for (const model of FREE_MODELS_FALLBACK) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        { model, ...payload },
        config,
      );
      console.log(`[OpenRouter] respondido por: ${model}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.log(`Modelo "${model}" indisponível (404), tentando próximo...`);
          lastError = error;
          continue;
        }
        if (error.response?.status === 429) {
          console.log(`Modelo "${model}" com rate limit (429), tentando próximo...`);
          lastError = error;
          continue;
        }
      }
      // erro diferente de 404/429 — não adianta trocar de modelo
      allRateLimited = false;
      lastError = error;
      break;
    }
  }

  if (allRateLimited && axios.isAxiosError(lastError) && lastError.response?.status === 429) {
    throw new Error('RATE_LIMIT_EXCEEDED', { cause: lastError });
  }

  throw lastError;
}
