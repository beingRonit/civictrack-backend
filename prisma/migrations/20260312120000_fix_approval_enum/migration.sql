-- Create enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "ApprovalStatus" AS ENUM ('AWAITING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop the default first
ALTER TABLE "Ticket" ALTER COLUMN "approval" DROP DEFAULT;

-- Alter the column to use the enum type
ALTER TABLE "Ticket" 
ALTER COLUMN "approval" TYPE "ApprovalStatus" 
USING CASE 
    WHEN "approval" = true THEN 'APPROVED'::"ApprovalStatus"
    WHEN "approval" = false THEN 'AWAITING'::"ApprovalStatus"
    ELSE 'AWAITING'::"ApprovalStatus"
END;

-- Set default value
ALTER TABLE "Ticket" 
ALTER COLUMN "approval" SET DEFAULT 'AWAITING'::"ApprovalStatus";
