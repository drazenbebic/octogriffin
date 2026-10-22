-- Remove duplicate entries left behind by retried deliveries
DELETE FROM "webhook_logs" a
USING "webhook_logs" b
WHERE a."delivery_uuid" = b."delivery_uuid"
  AND a."github_user_id" = b."github_user_id"
  AND a."id" > b."id";

-- CreateIndex
CREATE UNIQUE INDEX "webhook_logs_delivery_uuid_github_user_id_key" ON "webhook_logs"("delivery_uuid", "github_user_id");
