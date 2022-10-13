/*
  Warnings:

  - Added the required column `isPublic` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublic` to the `Drop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "isPublic" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Drop" ADD COLUMN     "isPublic" BOOLEAN NOT NULL;
