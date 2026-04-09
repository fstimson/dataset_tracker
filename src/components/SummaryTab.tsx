import React from 'react';
import { BarChart3, Calendar, DollarSign, FileText, XCircle } from 'lucide-react';
import { Dataset } from '../types';
import { formatDate } from '../utils/dateUtils';
import StatusBadge from './StatusBadge';

interface SummaryTabProps {
  selectedDataset: string | null;
  dataset: Dataset | null;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ selectedDataset, dataset }) => {
  if (!selectedDataset) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">No Dataset Selected</h3>
          <p className="text-gray-300">Please select a dataset from the Search tab to view its summary</p>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Dataset Not Found</h3>
          <p className="text-gray-300">The selected dataset could not be found</p>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon, label, value, className = "" }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    className?: string;
  }) => (
    <div className={`bg-gray-700 border border-gray-600 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-white">{value || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-white">Dataset Summary</h2>
      </div>

      <div className="bg-orange-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{dataset.trackerFileName}</h3>
            <div className="mt-2">
              <StatusBadge status={dataset.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-white opacity-90 text-sm">Dataset ID</p>
            <p className="font-mono font-bold text-sm">{dataset.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard
          icon={<FileText className="w-5 h-5 text-blue-400" />}
          label="Total Questions"
          value={dataset.questionCount.toString()}
        />

        <InfoCard
          icon={<DollarSign className="w-5 h-5 text-green-400" />}
          label="Rate"
          value={dataset.dsRate}
        />

        <InfoCard
          icon={<Calendar className="w-5 h-5 text-purple-400" />}
          label="Date Submitted"
          value={formatDate(dataset.dateSent)}
        />
      </div>

      {dataset.questions && dataset.questions.length > 0 && (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Questions</h4>
          <div className="space-y-3">
            {dataset.questions.map((q, idx) => (
              <div key={q.id} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-400">Q{q.question_number}</span>
                      <StatusBadge status={q.status} />
                    </div>
                    <p className="text-white text-sm">{q.question}</p>
                    {q.issues && q.issues !== 'all good' && (
                      <p className="text-yellow-400 text-xs mt-2">Issues: {q.issues}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;
