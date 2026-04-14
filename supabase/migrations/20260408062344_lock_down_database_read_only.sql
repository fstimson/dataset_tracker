/*
  # Lock Down Database Security - Read-Only Public Access

  ## Changes
  
  This migration implements strict security by removing all public write access.
  
  ### Security Model
  - **Public users**: READ ONLY (can view data)
  - **Authenticated users**: Full access (insert, update, delete)
  
  ### Tables Updated
  1. `files` - Remove dangerous public delete/update permissions
  2. `questions` - Lock to read-only for public
  3. `question_matches` - Lock to read-only for public  
  4. `cross reference` - Lock to read-only for public
  5. `matching report` - Lock to read-only for public
  6. `timeline` - Lock to read-only for public
  
  ### Policies Removed
  - All policies allowing public INSERT, UPDATE, DELETE operations
  
  ### Policies Added
  - Read-only SELECT policies for public users
  - Full access policies for authenticated users only
*/

-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert files" ON files;
DROP POLICY IF EXISTS "Anyone can update files" ON files;
DROP POLICY IF EXISTS "Anyone can delete files" ON files;
DROP POLICY IF EXISTS "Anyone can read files" ON files;

DROP POLICY IF EXISTS "Anyone can insert questions" ON questions;
DROP POLICY IF EXISTS "Anyone can read questions" ON questions;

DROP POLICY IF EXISTS "Anyone can insert question matches" ON question_matches;
DROP POLICY IF EXISTS "Anyone can read question matches" ON question_matches;

DROP POLICY IF EXISTS "Allow public insert to cross reference" ON "cross reference";
DROP POLICY IF EXISTS "Allow public read access to cross reference" ON "cross reference";
DROP POLICY IF EXISTS "Allow authenticated users to manage cross reference" ON "cross reference";

DROP POLICY IF EXISTS "Allow public insert to matching report" ON "matching report";
DROP POLICY IF EXISTS "Allow public read access to matching report" ON "matching report";
DROP POLICY IF EXISTS "Allow authenticated users to manage matching report" ON "matching report";

DROP POLICY IF EXISTS "Allow public insert to timeline" ON timeline;
DROP POLICY IF EXISTS "Allow public read access to timeline" ON timeline;
DROP POLICY IF EXISTS "Allow authenticated users to manage timeline" ON timeline;

-- FILES table: Read-only for public, full access for authenticated
CREATE POLICY "Public can view files"
  ON files FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert files"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update files"
  ON files FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete files"
  ON files FOR DELETE
  TO authenticated
  USING (true);

-- QUESTIONS table: Read-only for public, full access for authenticated
CREATE POLICY "Public can view questions"
  ON questions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (true);

-- QUESTION_MATCHES table: Read-only for public, full access for authenticated
CREATE POLICY "Public can view question matches"
  ON question_matches FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert question matches"
  ON question_matches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update question matches"
  ON question_matches FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete question matches"
  ON question_matches FOR DELETE
  TO authenticated
  USING (true);

-- CROSS REFERENCE table: Read-only for public, full access for authenticated
CREATE POLICY "Public can view cross reference"
  ON "cross reference" FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert cross reference"
  ON "cross reference" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cross reference"
  ON "cross reference" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cross reference"
  ON "cross reference" FOR DELETE
  TO authenticated
  USING (true);

-- MATCHING REPORT table: Read-only for public, full access for authenticated
CREATE POLICY "Public can view matching report"
  ON "matching report" FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert matching report"
  ON "matching report" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update matching report"
  ON "matching report" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete matching report"
  ON "matching report" FOR DELETE
  TO authenticated
  USING (true);

-- TIMELINE table: Read-only for public, full access for authenticated
CREATE POLICY "Public can view timeline"
  ON timeline FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert timeline"
  ON timeline FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update timeline"
  ON timeline FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete timeline"
  ON timeline FOR DELETE
  TO authenticated
  USING (true);
