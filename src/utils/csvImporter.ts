import { supabase } from '../lib/supabase';
import masterListCsv from '../data/master list.csv?raw';
import matchingReportCsv from '../data/matching report.csv?raw';

interface Question {
  id: string;
  tracker_file_name: string;
  question_number: number;
  question: string;
  status: string;
  issues: string;
}

interface QuestionMatch {
  id: string;
  tracker_file_name: string;
  question: string;
  question_match: string;
  matched_id: string;
  matched_tracker_file_name: string;
  status: string;
}

function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    return values;
  });
}

export async function importMasterList(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const rows = parseCSV(masterListCsv);
    const [header, ...dataRows] = rows;

    const questions: Question[] = dataRows.map(row => ({
      id: row[4],
      tracker_file_name: row[1],
      question_number: parseInt(row[2]) || 0,
      question: row[5],
      status: row[0],
      issues: row[3]
    }));

    const { error } = await supabase
      .from('questions')
      .upsert(questions, { onConflict: 'id' });

    if (error) throw error;

    return { success: true, count: questions.length };
  } catch (error) {
    return { success: false, count: 0, error: String(error) };
  }
}

export async function importMatchingReport(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const rows = parseCSV(matchingReportCsv);
    const [header, ...dataRows] = rows;

    const matches: QuestionMatch[] = dataRows.map(row => ({
      id: row[4],
      tracker_file_name: row[0],
      question: row[1],
      question_match: row[2],
      matched_id: row[5],
      matched_tracker_file_name: row[6],
      status: row[3]
    }));

    const { error } = await supabase
      .from('question_matches')
      .upsert(matches, { onConflict: 'id' });

    if (error) throw error;

    return { success: true, count: matches.length };
  } catch (error) {
    return { success: false, count: 0, error: String(error) };
  }
}

export async function importAllData(): Promise<{ success: boolean; message: string }> {
  const masterResult = await importMasterList();
  const matchingResult = await importMatchingReport();

  if (!masterResult.success || !matchingResult.success) {
    return {
      success: false,
      message: `Import failed: ${masterResult.error || matchingResult.error}`
    };
  }

  return {
    success: true,
    message: `Successfully imported ${masterResult.count} questions and ${matchingResult.count} matches`
  };
}
