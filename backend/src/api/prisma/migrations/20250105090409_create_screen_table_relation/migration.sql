/*
  Warnings:

  - You are about to drop the column `layout` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `live` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `storyContent` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ScreenType" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "layout",
DROP COLUMN "live",
DROP COLUMN "storyContent",
DROP COLUMN "theme";

-- CreateTable
CREATE TABLE "Screen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "live" BOOLEAN NOT NULL DEFAULT false,
    "type" "ScreenType" NOT NULL,
    "layout" JSONB NOT NULL,
    "theme" JSONB NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
