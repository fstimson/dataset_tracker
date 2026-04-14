import React from 'react';
import { HelpCircle, MessageSquare } from 'lucide-react';
import { datasetService } from '../lib/supabase';
import StatusBadge from './StatusBadge';

interface QuestionsTabProps {
  selectedDataset: string | null;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ selectedDataset }) => {
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [matches, setMatches] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!selectedDataset) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [questionsRes, matchesRes] = await Promise.all([
          datasetService.getQuestions(selectedDataset),
          datasetService.getQuestionMatches(selectedDataset)
        ]);

        setQuestions(questionsRes.data || []);
        setMatches(matchesRes.data || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDataset]);

  if (!selectedDataset) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">No Dataset Selected</h3>
          <p className="text-gray-300">Please select a dataset from the Search tab to view its questions</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Loading Questions...</h3>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">No Questions Found</h3>
          <p className="text-gray-300">No questions available for this dataset</p>
        </div>
      </div>
    );
  }

  const approvedQuestions = questions.filter(q => q.status === 'APPROVED');
  const rejectedQuestions = questions.filter(q => q.status === 'REJECTED');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <HelpCircle className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-white">Questions</h2>
      </div>

      <div className="bg-orange-500 rounded-lg p-4">
        <h3 className="text-xl font-bold text-white">{selectedDataset}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 border border-blue-500 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{questions.length}</p>
          <p className="text-sm text-blue-300">Total Questions</p>
        </div>
        <div className="bg-gray-800 border border-green-500 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{approvedQuestions.length}</p>
          <p className="text-sm text-green-300">Approved</p>
        </div>
        <div className="bg-gray-800 border border-red-500 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{rejectedQuestions.length}</p>
          <p className="text-sm text-red-300">Rejected</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-white mb-4">All Questions</h4>
        <div className="space-y-3">
          {questions.map((question) => {
            const match = matches.find(m => m.id === question.id);
            return (
              <div key={question.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-400">Q{question.question_number}</span>
                    <StatusBadge status={question.status} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border-l-4 ${
                    question.status === 'APPROVED' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'
                  }`}>
                    <p className="text-xs text-gray-400 mb-1">Current Question:</p>
                    <p className="text-white text-sm">{question.question}</p>
                  </div>

                  {match && (
                    <div className="p-3 rounded-lg bg-blue-900/20 border-l-4 border-blue-500">
                      <p className="text-xs text-gray-400 mb-1">Matched Question:</p>
                      <p className="text-white text-sm">{match.question_match}</p>
                      <p className="text-xs text-gray-400 mt-2">From: {match.matched_tracker_file_name}</p>
                    </div>
                  )}

                  {question.issues && question.issues !== 'all good' && (
                    <div className="text-xs text-yellow-400">
                      Issues: {question.issues}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionsTab;
