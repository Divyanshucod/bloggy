/*
  Warnings:

  - The values [INSIGHTFULL] on the enum `React` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "React_new" AS ENUM ('NONE', 'SMILE', 'ANNOYED', 'HEART', 'IDEA');
ALTER TABLE "Reaction" ALTER COLUMN "reaction" DROP DEFAULT;
ALTER TABLE "Reaction" ALTER COLUMN "reaction" TYPE "React_new" USING ("reaction"::text::"React_new");
ALTER TYPE "React" RENAME TO "React_old";
ALTER TYPE "React_new" RENAME TO "React";
DROP TYPE "React_old";
ALTER TABLE "Reaction" ALTER COLUMN "reaction" SET DEFAULT 'NONE';
COMMIT;
