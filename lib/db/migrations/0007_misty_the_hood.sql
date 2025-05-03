-- Add resetToken and resetTokenExpiry columns to User table
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "resetToken" varchar(256),
ADD COLUMN IF NOT EXISTS "resetTokenExpiry" timestamp;
--> statement-breakpoint
COMMENT ON COLUMN "User"."resetToken" IS 'Token for password reset functionality';
--> statement-breakpoint
COMMENT ON COLUMN "User"."resetTokenExpiry" IS 'Expiration timestamp for password reset token';