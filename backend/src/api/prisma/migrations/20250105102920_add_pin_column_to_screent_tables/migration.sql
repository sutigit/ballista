/*
  Warnings:

  - A unique constraint covering the columns `[pin]` on the table `Screen` will be added. If there are existing duplicate values, this will fail.
  - The required column `pin` was added to the `Screen` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "pin" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Screen_pin_key" ON "Screen"("pin");
