-- Let a trigger leave out empty commits and pull requests closed straight away

-- AlterTable
ALTER TABLE "triggers" ADD COLUMN "skip_spam" BOOLEAN NOT NULL DEFAULT true;
