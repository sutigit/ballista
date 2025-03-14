/*
  Warnings:

  - You are about to drop the column `generated` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `lockLayout` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `lockStoryContent` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `lockTheme` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "generated",
DROP COLUMN "lockLayout",
DROP COLUMN "lockStoryContent",
DROP COLUMN "lockTheme";
