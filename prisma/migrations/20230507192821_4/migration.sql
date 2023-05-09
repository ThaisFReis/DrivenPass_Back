/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "updatedAt",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
