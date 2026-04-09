/*
  # Update Database Column Names to Match Excel Headers

  1. Schema Changes
    - Update datasets table column names to match Excel headers
    - Add missing columns from Excel file
    - Maintain data integrity during migration

  2. New Columns Added
    - All columns from cross reference report
    - Proper naming convention matching Excel headers
    - Default values where appropriate

  3. Security
    - Maintain existing RLS policies
    - Keep current access permissions
*/

-- Update datasets table to match Excel column names
ALTER TABLE datasets 
  RENAME COLUMN tracker_file_name TO tracker_file_name_current;

-- Add new columns to match Excel headers
DO $$
BEGIN
  -- Add report_description if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'report_description') THEN
    ALTER TABLE datasets ADD COLUMN report_description text DEFAULT '';
  END IF;

  -- Add date_sent if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'date_sent') THEN
    ALTER TABLE datasets ADD COLUMN date_sent date;
  END IF;

  -- Rename rate to ds_rate
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'rate') THEN
    ALTER TABLE datasets RENAME COLUMN rate TO ds_rate;
  END IF;

  -- Rename status to status_current
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'status') THEN
    ALTER TABLE datasets RENAME COLUMN status TO status_current;
  END IF;

  -- Add paid_date if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'paid_date') THEN
    ALTER TABLE datasets ADD COLUMN paid_date date;
  END IF;

  -- Add approved column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'approved') THEN
    ALTER TABLE datasets ADD COLUMN approved boolean DEFAULT false;
  END IF;

  -- Add paid column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'paid') THEN
    ALTER TABLE datasets ADD COLUMN paid boolean DEFAULT false;
  END IF;

  -- Add open column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'open') THEN
    ALTER TABLE datasets ADD COLUMN open boolean DEFAULT false;
  END IF;

  -- Rename rejection_date to rejection_date (already correct)
  -- Rename reason_for_rejection to reason_for_rejection (already correct)

  -- Add why_the_rejection_was_app column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'why_the_rejection_was_app') THEN
    ALTER TABLE datasets ADD COLUMN why_the_rejection_was_app text DEFAULT '';
  END IF;

  -- Rename date_of_appeal (already correct)
  -- Rename date_of_appeal_rejection (already correct)
  -- Rename reason_for_appeal_rejection (already correct)
  -- Rename reason_for_rejection_3 (already correct)

  -- Add number_of_days_to_approval if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'number_of_days_to_approval') THEN
    ALTER TABLE datasets ADD COLUMN number_of_days_to_approval integer;
  END IF;

  -- Add number_of_days_to_rejection if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'number_of_days_to_rejection') THEN
    ALTER TABLE datasets ADD COLUMN number_of_days_to_rejection integer;
  END IF;

  -- Add unique_rejection_reasons if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'unique_rejection_reasons') THEN
    ALTER TABLE datasets ADD COLUMN unique_rejection_reasons text DEFAULT '';
  END IF;

  -- Add rejected_to_approved if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'rejected_to_approved') THEN
    ALTER TABLE datasets ADD COLUMN rejected_to_approved boolean DEFAULT false;
  END IF;

  -- Add removed column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'removed') THEN
    ALTER TABLE datasets ADD COLUMN removed boolean DEFAULT false;
  END IF;

  -- Add had_review_status if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'had_review_status') THEN
    ALTER TABLE datasets ADD COLUMN had_review_status boolean DEFAULT false;
  END IF;
END $$;