/*
  # Create datasets table for Master List project

  1. New Tables
    - `datasets`
      - `id` (uuid, primary key)
      - `tracker_file_name` (text, unique dataset identifier)
      - `status` (text, APPROVED/REJECTED/APPEAL/etc.)
      - `rate` (numeric, dataset rate)
      - `date_submitted` (date, when dataset was submitted)
      - `rejection_date` (date, when rejected)
      - `reason_for_rejection` (text)
      - `date_of_appeal` (date)
      - `date_of_appeal_rejection` (date)
      - `reason_for_appeal_rejection` (text)
      - `reason_for_rejection_3` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `datasets` table
    - Add policy for public read access (since this is a reporting tool)
*/

CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracker_file_name text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'SUBMITTED',
  rate numeric DEFAULT 0,
  date_submitted date,
  rejection_date date,
  reason_for_rejection text DEFAULT '',
  date_of_appeal date,
  date_of_appeal_rejection date,
  reason_for_appeal_rejection text DEFAULT '',
  reason_for_rejection_3 text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to datasets"
  ON datasets
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage datasets"
  ON datasets
  FOR ALL
  TO authenticated
  USING (true);