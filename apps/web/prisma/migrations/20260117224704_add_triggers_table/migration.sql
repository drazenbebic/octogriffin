-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('daily', 'weekly', 'monthly');

-- CreateEnum
CREATE TYPE "Attribute" AS ENUM ('str', 'int', 'con', 'per');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('up', 'down');

-- CreateTable
CREATE TABLE "triggers" (
    "id" BIGSERIAL NOT NULL,
    "uuid" VARCHAR(36) NOT NULL,
    "github_user_id" BIGINT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "event" VARCHAR(255) NOT NULL,
    "task_title" VARCHAR(255) NOT NULL,
    "task_alias" VARCHAR(255),
    "task_note" VARCHAR(255),
    "task_priority" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "task_tags" JSONB,
    "task_attribute" "Attribute" NOT NULL DEFAULT 'str',
    "task_frequency" "Frequency" NOT NULL DEFAULT 'daily',
    "score_direction" "Direction" NOT NULL DEFAULT 'up',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TriggersRepositories" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_TriggersRepositories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "triggers_uuid_key" ON "triggers"("uuid");

-- CreateIndex
CREATE INDEX "_TriggersRepositories_B_index" ON "_TriggersRepositories"("B");

-- AddForeignKey
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_github_user_id_fkey" FOREIGN KEY ("github_user_id") REFERENCES "github_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TriggersRepositories" ADD CONSTRAINT "_TriggersRepositories_A_fkey" FOREIGN KEY ("A") REFERENCES "github_selected_repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TriggersRepositories" ADD CONSTRAINT "_TriggersRepositories_B_fkey" FOREIGN KEY ("B") REFERENCES "triggers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
