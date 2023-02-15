/*
  Warnings:

  - You are about to drop the column `boxId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `dropId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `Box` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoxViews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Drop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Reaction" AS ENUM ('LIKE', 'DISLIKE');

-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_userId_fkey";

-- DropForeignKey
ALTER TABLE "BoxViews" DROP CONSTRAINT "BoxViews_boxId_fkey";

-- DropForeignKey
ALTER TABLE "BoxViews" DROP CONSTRAINT "BoxViews_userId_fkey";

-- DropForeignKey
ALTER TABLE "Drop" DROP CONSTRAINT "Drop_boxId_fkey";

-- DropForeignKey
ALTER TABLE "Drop" DROP CONSTRAINT "Drop_userId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_boxId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_dropId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_B_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "boxId",
DROP COLUMN "dropId",
ADD COLUMN     "cycleId" TEXT;

-- DropTable
DROP TABLE "Box";

-- DropTable
DROP TABLE "BoxViews";

-- DropTable
DROP TABLE "Drop";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "_TeamToUser";

-- CreateTable
CREATE TABLE "ItemReaction" (
    "id" TEXT NOT NULL,
    "reactionType" "Reaction" NOT NULL,
    "itemId" TEXT,
    "userId" TEXT,

    CONSTRAINT "ItemReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cycle" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Cycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemReaction" ADD CONSTRAINT "ItemReaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReaction" ADD CONSTRAINT "ItemReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cycle" ADD CONSTRAINT "Cycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cycle" ADD CONSTRAINT "Cycle_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
