/*
  # Create timeline table for tracking dataset events

  1. New Tables
    - `timeline`
      - `id` (uuid, primary key)
      - `period` (date, event date)
      - `status` (text, event status)
      - `dataset_filename` (text, which dataset)
      - `notes` (text, additional details)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `timeline` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,
  status text NOT NULL,
  dataset_filename text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to timeline"
  ON timeline
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage timeline"
  ON timeline
  FOR ALL
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS timeline_period_idx ON timeline(period DESC);
CREATE INDEX IF NOT EXISTS timeline_dataset_idx ON timeline(dataset_filename);