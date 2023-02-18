/*
  Warnings:

  - The primary key for the `ItemComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ItemComment` table. All the data in the column will be lost.
  - The primary key for the `ItemReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ItemReaction` table. All the data in the column will be lost.
  - Made the column `userId` on table `ItemComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `itemId` on table `ItemComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `itemId` on table `ItemReaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `ItemReaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ItemComment" DROP CONSTRAINT "ItemComment_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemComment" DROP CONSTRAINT "ItemComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ItemReaction" DROP CONSTRAINT "ItemReaction_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemReaction" DROP CONSTRAINT "ItemReaction_userId_fkey";

-- DropIndex
DROP INDEX "ItemReaction_userId_key";

-- AlterTable
ALTER TABLE "ItemComment" DROP CONSTRAINT "ItemComment_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "itemId" SET NOT NULL,
ADD CONSTRAINT "ItemComment_pkey" PRIMARY KEY ("userId", "itemId");

-- AlterTable
ALTER TABLE "ItemReaction" DROP CONSTRAINT "ItemReaction_pkey",
DROP COLUMN "id",
ALTER COLUMN "itemId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "ItemReaction_pkey" PRIMARY KEY ("userId", "itemId");

-- AddForeignKey
ALTER TABLE "ItemReaction" ADD CONSTRAINT "ItemReaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReaction" ADD CONSTRAINT "ItemReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
