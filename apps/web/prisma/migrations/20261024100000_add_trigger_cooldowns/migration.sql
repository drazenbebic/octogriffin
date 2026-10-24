-- Let a trigger rest for a while after it scores

-- AlterTable
ALTER TABLE "triggers" ADD COLUMN "cooldown_seconds" INTEGER,
ADD COLUMN "last_scored_at" TIMESTAMP(3);
