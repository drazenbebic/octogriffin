-- Let a trigger score at most a set number of times per Habitica day

-- AlterTable
ALTER TABLE "triggers" ADD COLUMN "cap_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "cap_day" VARCHAR(10),
ADD COLUMN "daily_cap" INTEGER;
