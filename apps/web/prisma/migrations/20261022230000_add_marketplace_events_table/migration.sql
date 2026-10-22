-- CreateTable
CREATE TABLE "marketplace_events" (
    "id" BIGSERIAL NOT NULL,
    "uuid" VARCHAR(36) NOT NULL,
    "delivery_uuid" VARCHAR(36) NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "account_id" BIGINT NOT NULL,
    "account_login" VARCHAR(255) NOT NULL,
    "account_type" VARCHAR(255) NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "sender_login" VARCHAR(255) NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "plan_name" VARCHAR(255) NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_events_uuid_key" ON "marketplace_events"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_events_delivery_uuid_key" ON "marketplace_events"("delivery_uuid");

-- CreateIndex
CREATE INDEX "marketplace_events_account_id_idx" ON "marketplace_events"("account_id");

