-- AlterTable
ALTER TABLE "books" ADD COLUMN     "embedding" JSONB,
ADD COLUMN     "embedding_update_at" TIMESTAMP(3);
