ALTER TABLE "User" ADD COLUMN "email" TEXT;
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

UPDATE "User" SET
  "email" = 'user-' || "id" || '@migration.local',
  "passwordHash" = '$2b$10$mVJ7tNduGoUyam3DO7Bwd.8L4wx4UcX7FNkXOYMIQY3W8OSAaxhrC'
WHERE "email" IS NULL;

ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
