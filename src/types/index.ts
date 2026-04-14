export interface Dataset {
  id: string;
  trackerFileName: string;
  status: 'APPROVED' | 'REJECTED';
  dsRate: string;
  dateSent: string | null;
  questionCount: number;
  questions?: QuestionData[];
}

export interface QuestionData {
  id: string;
  tracker_file_name: string;
  question_number: number;
  question: string;
  status: string;
  issues: string;
  created_at?: string;
}

export interface Question {
  id: string;
  trackerFileName: string;
  currentQuestion: string;
  matchedQuestion: string;
  status: string;
}

export interface TimelineEntry {
  id: string;
  period: string;
  status_current: string;
  datasetFilename: string;
  notes: string;
}

export type TabType = 'Search' | 'Summary' | 'Questions' | 'Datasets' | 'Timeline' | 'Import';