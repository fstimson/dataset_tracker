/*
  # Create Cross Reference Table

  1. New Tables
    - cross reference
      - Core table for tracking dataset submissions and statuses
      - Contains all metadata about each dataset submission
      - Maps to Excel cross reference report

  2. Columns
    - tracker_file_name_current (text, unique dataset identifier)
    - status_current (text, current status: APPROVED/REJECTED/etc.)
    - ds_rate (numeric, dataset rate)
    - date_sent (date, submission date)
    - rejection_date (date)
    - reason_for_rejection (text)
    - And many other tracking fields

  3. Security
    - Enable RLS
    - Allow public read access (reporting tool)
*/

CREATE TABLE IF NOT EXISTS "cross reference" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracker_file_name_current text UNIQUE NOT NULL,
  status_current text NOT NULL DEFAULT 'SUBMITTED',
  ds_rate numeric DEFAULT 0,
  date_sent date,
  rejection_date date,
  reason_for_rejection text DEFAULT '',
  date_of_appeal date,
  date_of_appeal_rejection date,
  reason_for_appeal_rejection text DEFAULT '',
  reason_for_rejection_3 text DEFAULT '',
  report_description text DEFAULT '',
  paid_date date,
  approved boolean DEFAULT false,
  paid boolean DEFAULT false,
  open boolean DEFAULT false,
  why_the_rejection_was_app text DEFAULT '',
  number_of_days_to_approval integer,
  number_of_days_to_rejection integer,
  unique_rejection_reasons text DEFAULT '',
  rejected_to_approved boolean DEFAULT false,
  removed boolean DEFAULT false,
  had_review_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE "cross reference" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to cross reference"
  ON "cross reference"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage cross reference"
  ON "cross reference"
  FOR ALL
  TO authenticated
  USING (true);