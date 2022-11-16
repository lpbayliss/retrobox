/*
  Warnings:

  - Made the column `boxId` on table `Drop` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Drop" DROP CONSTRAINT "Drop_boxId_fkey";

-- AlterTable
ALTER TABLE "Drop" ALTER COLUMN "boxId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
