export type ChatIntent =
  | { type: 'recommend_by_history' }
  | { type: 'recommend_by_query'; query: string; category?: string }
  | { type: 'chat'; message: string };

export interface IntentService {
  classify(userMessage: string): Promise<ChatIntent>;
}
