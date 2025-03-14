/*
  Warnings:

  - Made the column `layout` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `theme` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `storyContent` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "threadId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "layout" SET NOT NULL,
ALTER COLUMN "theme" SET NOT NULL,
ALTER COLUMN "storyContent" SET NOT NULL;
