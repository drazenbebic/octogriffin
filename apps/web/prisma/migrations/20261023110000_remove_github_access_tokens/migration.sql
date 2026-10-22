-- Octogriffin never used the GitHub tokens from signing in, so stop keeping them

-- AlterTable
ALTER TABLE "github_users" DROP COLUMN "access_token",
DROP COLUMN "expires_in",
DROP COLUMN "refresh_token",
DROP COLUMN "refresh_token_expires_in",
DROP COLUMN "scope",
DROP COLUMN "token_type";
