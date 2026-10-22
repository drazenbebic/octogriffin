-- An installation now belongs to a user, so one user can have several

-- AlterTable
ALTER TABLE "github_installations" ADD COLUMN "github_user_id" BIGINT;

-- Every user had exactly one installation, link it back to them
UPDATE "github_installations" AS i
SET "github_user_id" = u."id"
FROM "github_users" AS u
WHERE u."installation_id" = i."id";

-- An installation without a user can't reward anyone
DELETE FROM "github_installations" WHERE "github_user_id" IS NULL;

ALTER TABLE "github_installations" ALTER COLUMN "github_user_id" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "github_users" DROP CONSTRAINT "github_users_installation_id_fkey";

-- DropIndex
DROP INDEX "github_users_installation_id_key";

-- AlterTable
ALTER TABLE "github_users" DROP COLUMN "installation_id";

-- CreateIndex
CREATE INDEX "github_installations_github_user_id_idx" ON "github_installations"("github_user_id");

-- AddForeignKey
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_github_user_id_fkey" FOREIGN KEY ("github_user_id") REFERENCES "github_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
