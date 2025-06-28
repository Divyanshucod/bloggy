/*
  Warnings:

  - Added the required column `blogJson` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `htmlContent` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "blogJson" JSONB NOT NULL,
ADD COLUMN     "htmlContent" TEXT NOT NULL,
ALTER COLUMN "publishedDate" DROP DEFAULT;
