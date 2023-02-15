/*
  Warnings:

  - Added the required column `isPublic` to the `Cycle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cycle" ADD COLUMN     "isPublic" BOOLEAN NOT NULL;
