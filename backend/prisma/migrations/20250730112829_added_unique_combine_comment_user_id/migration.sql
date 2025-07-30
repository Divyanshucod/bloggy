/*
  Warnings:

  - A unique constraint covering the columns `[commentId,userId]` on the table `CommentReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommentReaction_commentId_userId_key" ON "CommentReaction"("commentId", "userId");
