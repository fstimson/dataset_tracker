/*
  # Redesign Schema for Question-Level Data
  
  This migration restructures the database to match the actual data available in the CSV files.
  
  ## Changes Made
  
  1. **New Tables**
     - `questions` - Stores individual questions from master list.csv
       - `id` (text, primary key) - Unique question identifier
       - `tracker_file_name` (text) - Dataset filename
       - `question_number` (integer) - Question number within dataset
       - `question` (text) - The actual question text
       - `status` (text) - APPROVED or REJECTED
       - `issues` (text) - Any issues noted
       - `created_at` (timestamp)
     
     - `question_matches` - Stores matching report data for rejected questions
       - `id` (text, primary key)
       - `tracker_file_name` (text)
       - `question` (text)
       - `question_match` (text)
       - `matched_id` (text)
       - `matched_tracker_file_name` (text)
       - `status` (text)
       - `created_at` (timestamp)
  
  2. **Security**
     - Enable RLS on all tables
     - Allow public read access (for displaying data)
     - Allow public insert access (for CSV imports)
  
  ## Notes
  - The datasets table will be populated via aggregation from questions
  - This structure matches the actual CSV data available
  - Missing data (rates, dates) will need to be added separately if available
*/

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS question_matches CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id text PRIMARY KEY,
  tracker_file_name text NOT NULL,
  question_number integer NOT NULL,
  question text NOT NULL,
  status text NOT NULL,
  issues text,
  created_at timestamptz DEFAULT now()
);

-- Create question_matches table for rejected question mappings
CREATE TABLE IF NOT EXISTS question_matches (
  id text PRIMARY KEY,
  tracker_file_name text NOT NULL,
  question text NOT NULL,
  question_match text,
  matched_id text,
  matched_tracker_file_name text,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_matches ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert questions"
  ON questions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read question matches"
  ON question_matches FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert question matches"
  ON question_matches FOR INSERT
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_tracker_file ON questions(tracker_file_name);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_question_matches_tracker_file ON question_matches(tracker_file_name);
