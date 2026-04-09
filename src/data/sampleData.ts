import { Dataset, Question, TimelineEntry } from '../types';

// Sample data that matches the database schema structure
export const sampleDatasets: Dataset[] = [
  {
    id: '1',
    tracker_file_name_current: 'Data Set #10 report - Frank Stimson.xlsx',
    report_description: 'Sample approved dataset',
    date_sent: '2024-01-15',
    ds_rate: 750,
    status_current: 'APPROVED',
    paid_date: '2024-02-15',
    approved: true,
    paid: true,
    open: false,
    rejection_date: null,
    reason_for_rejection: '',
    why_the_rejection_was_app: '',
    date_of_appeal: null,
    date_of_appeal_rejection: null,
    reason_for_appeal_rejection: '',
    reason_for_rejection_3: '',
    number_of_days_to_approval: 30,
    number_of_days_to_rejection: null,
    unique_rejection_reasons: '',
    rejected_to_approved: false,
    removed: false,
    had_review_status: false
  },
  {
    id: '2',
    tracker_file_name_current: 'Data Set #2-13 report - Frank Stimson.csv',
    report_description: 'Sample rejected dataset',
    date_sent: '2024-01-10',
    ds_rate: 500,
    status_current: 'REJECTED',
    paid_date: null,
    approved: false,
    paid: false,
    open: true,
    rejection_date: '2024-01-15',
    reason_for_rejection: 'Insufficient data quality standards',
    why_the_rejection_was_app: 'Data quality concerns',
    date_of_appeal: '2024-01-20',
    date_of_appeal_rejection: '2024-01-25',
    reason_for_appeal_rejection: 'Original rejection criteria still apply',
    reason_for_rejection_3: 'Data formatting inconsistencies',
    number_of_days_to_approval: null,
    number_of_days_to_rejection: 5,
    unique_rejection_reasons: '1',
    rejected_to_approved: false,
    removed: false,
    had_review_status: true
  },
  {
    id: '3',
    tracker_file_name_current: 'Data Set #11 report - Frank Stimson.csv',
    report_description: 'Another approved dataset',
    date_sent: '2024-01-18',
    ds_rate: 600,
    status_current: 'APPROVED',
    paid_date: '2024-02-18',
    approved: true,
    paid: true,
    open: false,
    rejection_date: null,
    reason_for_rejection: '',
    why_the_rejection_was_app: '',
    date_of_appeal: null,
    date_of_appeal_rejection: null,
    reason_for_appeal_rejection: '',
    reason_for_rejection_3: '',
    number_of_days_to_approval: 31,
    number_of_days_to_rejection: null,
    unique_rejection_reasons: '',
    rejected_to_approved: false,
    removed: false,
    had_review_status: false
  },
  {
    id: '4',
    tracker_file_name_current: 'Data Set #2-24 report - Frank Stimson.csv',
    report_description: 'Rejected due to privacy issues',
    date_sent: '2024-01-12',
    ds_rate: 600,
    status_current: 'REJECTED',
    paid_date: null,
    approved: false,
    paid: false,
    open: true,
    rejection_date: '2024-01-17',
    reason_for_rejection: 'Privacy compliance issues',
    why_the_rejection_was_app: 'HIPAA concerns',
    date_of_appeal: '2024-01-22',
    date_of_appeal_rejection: '2024-01-27',
    reason_for_appeal_rejection: 'Cannot resolve privacy concerns',
    reason_for_rejection_3: 'HIPAA compliance violations',
    number_of_days_to_approval: null,
    number_of_days_to_rejection: 5,
    unique_rejection_reasons: '1',
    rejected_to_approved: false,
    removed: false,
    had_review_status: true
  },
  {
    id: '5',
    tracker_file_name_current: 'Data Set #12 report - Frank Stimson.csv',
    report_description: 'High quality approved dataset',
    date_sent: '2024-01-20',
    ds_rate: 800,
    status_current: 'APPROVED',
    paid_date: '2024-02-20',
    approved: true,
    paid: true,
    open: false,
    rejection_date: null,
    reason_for_rejection: '',
    why_the_rejection_was_app: '',
    date_of_appeal: null,
    date_of_appeal_rejection: null,
    reason_for_appeal_rejection: '',
    reason_for_rejection_3: '',
    number_of_days_to_approval: 31,
    number_of_days_to_rejection: null,
    unique_rejection_reasons: '',
    rejected_to_approved: false,
    removed: false,
    had_review_status: false
  },
  {
    id: '6',
    tracker_file_name_current: 'Data Set #2-28 report - Frank Stimson.csv',
    report_description: 'Documentation issues',
    date_sent: '2024-01-14',
    ds_rate: 450,
    status_current: 'REJECTED',
    paid_date: null,
    approved: false,
    paid: false,
    open: true,
    rejection_date: '2024-01-19',
    reason_for_rejection: 'Incomplete documentation',
    why_the_rejection_was_app: 'Missing required documentation',
    date_of_appeal: '2024-01-24',
    date_of_appeal_rejection: '2024-01-29',  
    reason_for_appeal_rejection: 'Documentation still insufficient',
    reason_for_rejection_3: 'Missing critical metadata',
    number_of_days_to_approval: null,
    number_of_days_to_rejection: 5,
    unique_rejection_reasons: '1',
    rejected_to_approved: false,
    removed: false,
    had_review_status: true
  }
];

export const sampleQuestions: Question[] = [
  {
    id: '1',
    trackerFileName: 'Data Set #2-13 report - Frank Stimson.csv',
    currentQuestion: 'What is the overall sentiment distribution across different social media platforms?',
    matchedQuestion: 'Analyze sentiment patterns across various social media channels including engagement metrics',
    status: 'REJECTED'
  },
  {
    id: '2',
    trackerFileName: 'Data Set #2-13 report - Frank Stimson.csv',
    currentQuestion: 'How do seasonal trends affect user engagement rates?',
    matchedQuestion: 'Examine temporal patterns in user interaction data with focus on seasonal variations',
    status: 'REJECTED'
  },
  {
    id: '3',
    trackerFileName: 'Data Set #2-24 report - Frank Stimson.csv',
    currentQuestion: 'What are the most common diagnosis patterns by age group?',
    matchedQuestion: 'Analyze diagnostic trends segmented by demographic categories with privacy protection',
    status: 'REJECTED'
  },
  {
    id: '4',
    trackerFileName: 'Data Set #2-24 report - Frank Stimson.csv',
    currentQuestion: 'How do treatment outcomes vary by geographic region?',
    matchedQuestion: 'Compare regional healthcare outcomes while maintaining patient anonymity standards',
    status: 'REJECTED'
  },
  {
    id: '5',
    trackerFileName: 'Data Set #2-28 report - Frank Stimson.csv',
    currentQuestion: 'What factors influence customer purchase decisions?',
    matchedQuestion: 'Analyze customer behavior patterns and decision-making factors with proper data governance',
    status: 'REJECTED'
  },
  {
    id: '6',
    trackerFileName: 'Data Set #2-41 report - Frank Stimson.csv',
    currentQuestion: 'How do market trends correlate with product sales?',
    matchedQuestion: 'Examine market correlation patterns with comprehensive sales data analysis',
    status: 'REJECTED'
  }
];

export const sampleTimeline: TimelineEntry[] = [
  {
    id: '1',
    period: '2024-02-04',
    status_current: 'Appeal Rejected',
    datasetFilename: 'Data Set #3-1 report - Frank Stimson.csv',
    notes: 'Sample size remains inadequate for statistical significance'
  },
  {
    id: '2',
    period: '2024-02-02',
    status_current: 'Appeal Rejected',
    datasetFilename: 'Data Set #2-42 report - Frank Stimson.csv',
    notes: 'Licensing concerns could not be resolved'
  },
  {
    id: '3',
    period: '2024-01-31',
    status_current: 'Appeal Rejected',
    datasetFilename: 'Data Set #2-41 report - Frank Stimson.csv',
    notes: 'Data validation issues persist despite corrections'
  },
  {
    id: '4',
    period: '2024-01-29',
    status_current: 'Appeal Rejected',
    datasetFilename: 'Data Set #2-28 report - Frank Stimson.csv',
    notes: 'Documentation still insufficient after appeal'
  },
  {
    id: '5',
    period: '2024-01-28',
    status_current: 'Approved',
    datasetFilename: 'Data Set #15 report.csv',
    notes: 'Dataset approved after successful validation'
  },
  {
    id: '6',
    period: '2024-01-27',
    status_current: 'Appeal Rejected',
    datasetFilename: 'Data Set #2-24 report - Frank Stimson.csv',
    notes: 'Privacy concerns could not be adequately addressed'
  },
  {
    id: '7',
    period: '2024-01-25',
    status_current: 'Approved',
    datasetFilename: 'Data Set #14 report',
    notes: 'High-quality dataset approved for use'
  },
  {
    id: '8',
    period: '2024-01-25',
    status_current: 'Appeal Rejected',
    datasetFilename: 'Data Set #2-13 report - Frank Stimson.csv',
    notes: 'Appeal rejected - original criteria still apply'
  },
  {
    id: '9',
    period: '2024-01-22',
    status_current: 'Approved',
    datasetFilename: 'Data Set #13 report',
    notes: 'Dataset meets all quality standards'
  },
  {
    id: '10',
    period: '2024-01-20',
    status_current: 'Approved',
    datasetFilename: 'Data Set #12 report - Frank Stimson.csv',
    notes: 'Comprehensive dataset approved'
  },
  {
    id: '11',
    period: '2024-01-18',
    status_current: 'Approved',
    datasetFilename: 'Data Set #11 report - Frank Stimson.csv',
    notes: 'Dataset submitted and approved efficiently'
  },
  {
    id: '12',
    period: '2024-01-15',
    status_current: 'Approved',
    datasetFilename: 'Data Set #10 report - Frank Stimson.xlsx',
    notes: 'Initial dataset submission approved'
  }
];