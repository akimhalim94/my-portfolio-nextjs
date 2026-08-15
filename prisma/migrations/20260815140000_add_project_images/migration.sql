-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
