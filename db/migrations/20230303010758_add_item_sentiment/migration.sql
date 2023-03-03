-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "sentiment" "Sentiment" NOT NULL DEFAULT 'NEUTRAL';
