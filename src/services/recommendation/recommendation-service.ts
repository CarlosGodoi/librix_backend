import type { Book } from 'generated/prisma/client';

export interface FindSimilarOptions {
  excludeIds?: string[];
  category?: string;
  limit?: number;
}

export interface RecommendationService {
  getLoanedBooks(userId: string, take?: number): Promise<Book[]>;
  findSimilarByHistory(userId: string, limit?: number): Promise<Book[]>;
  findSimilarByVector(vector: number[], options?: FindSimilarOptions): Promise<Book[]>;
}
