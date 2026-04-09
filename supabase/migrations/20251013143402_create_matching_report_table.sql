/*
  # Create Matching Report Table

  1. New Tables
    - matching report
      - Stores question comparison data
      - Maps rejected questions to approved alternatives
      - Used for Questions tab

  2. Columns
    - tracker_file_name_current (text, dataset reference)
    - status_current (text, question status)
    - question_current (text, the rejected question)
    - question_match (text, the approved alternative)
    - matched_id (text, ID of matched question)
    - matched_tracker_file_name (text, source dataset)

  3. Security
    - Enable RLS
    - Allow public read access
*/

CREATE TABLE IF NOT EXISTS "matching report" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracker_file_name_current text NOT NULL,
  status_current text DEFAULT 'REJECTED',
  question_current text NOT NULL,
  question_match text DEFAULT '',
  matched_id text DEFAULT '',
  matched_tracker_file_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE "matching report" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to matching report"
  ON "matching report"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage matching report"
  ON "matching report"
  FOR ALL
  TO authenticated
  USING (true);