/*
  Warnings:

  - The values [STUDENT,TEACHER] on the enum `Profile` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Profile_new" AS ENUM ('ADMIN', 'LIBRARIAN', 'VISITOR');
ALTER TABLE "users" ALTER COLUMN "profile" TYPE "Profile_new" USING ("profile"::text::"Profile_new");
ALTER TYPE "Profile" RENAME TO "Profile_old";
ALTER TYPE "Profile_new" RENAME TO "Profile";
DROP TYPE "public"."Profile_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
