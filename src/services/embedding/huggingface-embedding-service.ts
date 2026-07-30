import axios from 'axios';
import type { EmbeddingService } from './embedding-service';

export class HuggingFaceEmbeddingService implements EmbeddingService {
  private readonly modelUrl =
    'https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/pipeline/feature-extraction';

  async getEmbedding(text: string): Promise<number[]> {
    const response = await axios.post(
      this.modelUrl,
      { inputs: text },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}` } },
    );

    return response.data;
  }
}
