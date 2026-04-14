/*
  # Fix RLS Policies for Public Insert

  1. Changes
    - Add public INSERT policy for cross reference table
    - Add public INSERT policy for matching report table
    - Add public INSERT policy for timeline table
    - These allow the initial data import to work

  2. Security
    - Temporary policies for data import
    - Can be restricted later once data is loaded
*/

DROP POLICY IF EXISTS "Allow public insert to cross reference" ON "cross reference";
DROP POLICY IF EXISTS "Allow public insert to matching report" ON "matching report";
DROP POLICY IF EXISTS "Allow public insert to timeline" ON "timeline";

CREATE POLICY "Allow public insert to cross reference"
  ON "cross reference"
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert to matching report"
  ON "matching report"
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert to timeline"
  ON "timeline"
  FOR INSERT
  TO public
  WITH CHECK (true);
