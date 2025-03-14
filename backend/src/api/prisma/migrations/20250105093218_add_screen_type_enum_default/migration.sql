-- AlterEnum
ALTER TYPE "ScreenType" ADD VALUE 'XLARGE';

-- AlterTable
ALTER TABLE "Screen" ALTER COLUMN "type" SET DEFAULT 'LARGE';
