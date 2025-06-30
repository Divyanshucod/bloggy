/*
  Warnings:

  - You are about to drop the column `htmlContent` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "htmlContent",
ALTER COLUMN "publishedDate" SET DEFAULT CURRENT_TIMESTAMP;
