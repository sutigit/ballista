/*
  Warnings:

  - You are about to alter the column `pin` on the `Screen` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(8)`.

*/
-- AlterTable
ALTER TABLE "Screen" ALTER COLUMN "pin" SET DATA TYPE VARCHAR(8);
