/*
  # Create questions table for question comparisons

  1. New Tables
    - `questions`
      - `id` (uuid, primary key)
      - `tracker_file_name` (text, references dataset)
      - `current_question` (text, the rejected question)
      - `matched_question` (text, the approved alternative)
      - `status` (text, question status)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `questions` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracker_file_name text NOT NULL,
  current_question text NOT NULL,
  matched_question text DEFAULT '',
  status text DEFAULT 'REJECTED',
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (tracker_file_name) REFERENCES datasets(tracker_file_name) ON DELETE CASCADE
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to questions"
  ON questions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (true);