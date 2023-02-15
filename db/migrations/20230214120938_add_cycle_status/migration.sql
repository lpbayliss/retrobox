/*
  Warnings:

  - Added the required column `status` to the `Cycle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CycleStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Cycle" ADD COLUMN     "status" "CycleStatus" NOT NULL;
