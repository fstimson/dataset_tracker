/*
  # Create Timeline Table

  1. New Tables
    - timeline
      - Tracks events and status changes over time
      - Used for Timeline tab visualization
      - Shows historical data by period

  2. Columns
    - period (date, event date)
    - status_current (text, status at that time)
    - tracker_file_name_current (text, dataset reference)
    - final_status (text, final outcome)
    - notes (text, additional details)

  3. Security
    - Enable RLS
    - Allow public read access
*/

CREATE TABLE IF NOT EXISTS "timeline" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,
  status_current text NOT NULL,
  tracker_file_name_current text NOT NULL,
  final_status text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE "timeline" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to timeline"
  ON "timeline"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage timeline"
  ON "timeline"
  FOR ALL
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS timeline_period_idx ON "timeline"(period DESC);
CREATE INDEX IF NOT EXISTS timeline_dataset_idx ON "timeline"(tracker_file_name_current);