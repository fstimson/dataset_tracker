import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jnzkmfujuhenfmqvmkgm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemttZnVqdWhlbmZtcXZta2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDc2ODcsImV4cCI6MjA3NTkyMzY4N30.sM12Or1IxE6hDA1WPKFZIbAnn1wuCJ0Dl9PIGGZIK5s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations for datasets
export const datasetService = {
  // Get datasets with pagination and search (aggregated from questions)
  async getDatasets(page = 1, pageSize = 50, search = '', status?: string) {
    console.log('🔍 Querying datasets with params:', { page, pageSize, search, status });

    let query = supabase
      .from('questions')
      .select('*')

    if (search) {
      query = query.ilike('tracker_file_name', `%${search}%`)
    }

    if (status && status !== 'ALL') {
      query = query.eq('status', status)
    }

    const { data: questions, error } = await query;

    if (error) {
      console.error('❌ Supabase error details:', error);
      return { data: null, count: 0, error };
    }

    const datasetsMap = new Map();
    questions?.forEach(q => {
      const key = q.tracker_file_name;
      if (!datasetsMap.has(key)) {
        datasetsMap.set(key, {
          id: key,
          trackerFileName: q.tracker_file_name,
          status: q.status,
          dsRate: '$0',
          dateSent: null,
          questionCount: 0
        });
      }
      datasetsMap.get(key).questionCount++;
    });

    const datasets = Array.from(datasetsMap.values());
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    console.log('📊 Aggregated datasets:', datasets.length);

    return {
      data: datasets.slice(start, end),
      count: datasets.length,
      error: null
    };
  },

  // Get single dataset by filename (aggregated from questions)
  async getDatasetByFilename(filename: string) {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('tracker_file_name', filename);

    if (error || !questions || questions.length === 0) {
      return { data: null, error: error || new Error('Dataset not found') };
    }

    const dataset = {
      id: filename,
      trackerFileName: filename,
      status: questions[0].status,
      dsRate: '$0',
      dateSent: null,
      questionCount: questions.length,
      questions: questions
    };

    return { data: dataset, error: null };
  },

  // Get questions for a dataset
  async getQuestions(filename: string) {
    return supabase
      .from('questions')
      .select('*')
      .eq('tracker_file_name', filename)
      .order('question_number', { ascending: true });
  },

  // Get question matches for rejected questions
  async getQuestionMatches(filename: string) {
    return supabase
      .from('question_matches')
      .select('*')
      .eq('tracker_file_name', filename);
  },

  // Get timeline data
  async getTimeline(filename?: string) {
    let query = supabase
      .from('timeline')
      .select('*')
      .order('period', { ascending: false })

    if (filename) {
      query = query.eq('tracker_file_name_current', filename)
    }

    return query
  },

  // Get status summary counts (from questions aggregated by dataset)
  async getStatusSummary() {
    const { data: questions } = await supabase
      .from('questions')
      .select('tracker_file_name, status');

    const datasetsMap = new Map();
    questions?.forEach(q => {
      if (!datasetsMap.has(q.tracker_file_name)) {
        datasetsMap.set(q.tracker_file_name, q.status);
      }
    });

    const counts: Record<string, number> = {};
    Array.from(datasetsMap.values()).forEach(status => {
      counts[status] = (counts[status] || 0) + 1;
    });

    return counts;
  }
}