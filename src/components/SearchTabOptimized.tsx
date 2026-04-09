import React, { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDatasets } from '../hooks/useDatasets';

interface SearchTabOptimizedProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectDataset: (dataset: string) => void;
  selectedDataset: string | null;
}

const SearchTabOptimized: React.FC<SearchTabOptimizedProps> = ({
  searchQuery,
  onSearchChange,
  onSelectDataset,
  selectedDataset
}) => {
  const [approvedPage, setApprovedPage] = useState(1)
  const [rejectedPage, setRejectedPage] = useState(1)
  const pageSize = 25

  // Fetch approved datasets
  const { 
    datasets: approvedDatasets, 
    loading: approvedLoading, 
    totalCount: approvedTotal 
  } = useDatasets(approvedPage, pageSize, searchQuery, 'APPROVED')

  // Fetch rejected datasets
  const { 
    datasets: rejectedDatasets, 
    loading: rejectedLoading, 
    totalCount: rejectedTotal 
  } = useDatasets(rejectedPage, pageSize, searchQuery, 'REJECTED')

  const DatasetList = ({ 
    datasets, 
    loading, 
    total, 
    page, 
    onPageChange, 
    type 
  }: {
    datasets: any[]
    loading: boolean
    total: number
    page: number
    onPageChange: (page: number) => void
    type: 'approved' | 'rejected'
  }) => {
    const totalPages = Math.ceil(total / pageSize)
    const icon = type === 'approved' ? '🟢' : '❌'
    
    return (
      <div className="max-h-96 overflow-y-auto bg-gray-900">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            <span className="ml-2 text-gray-400">Loading datasets...</span>
          </div>
        ) : datasets.length > 0 ? (
          <>
            {datasets.map((dataset) => (
              <button
                key={dataset.id}
                onClick={() => onSelectDataset(dataset.tracker_file_name_current)}
                className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700 last:border-b-0 ${
                  selectedDataset === dataset.tracker_file_name_current ? 'bg-gray-700 border-l-4 border-l-orange-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${type === 'approved' ? 'text-green-500' : 'text-red-500'} text-lg`}>
                    {icon}
                  </div>
                  <span className="text-white font-medium">{dataset.tracker_file_name_current}</span>
                </div>
                <div className="mt-1 text-sm text-gray-400 ml-8">
                  Rate: ${dataset.ds_rate} • Submitted: {dataset.date_sent}
                </div>
              </button>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-gray-800 border-t border-gray-700">
                <button
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-300 text-sm">
                  Page {page} of {totalPages} ({total} total)
                </span>
                <button
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-8 text-center text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <p>No {type} datasets found</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approved Datasets */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="bg-orange-500 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Approved Datasets</h3>
            <p className="text-white opacity-90 text-sm">{approvedTotal} datasets</p>
          </div>
          <DatasetList
            datasets={approvedDatasets}
            loading={approvedLoading}
            total={approvedTotal}
            page={approvedPage}
            onPageChange={setApprovedPage}
            type="approved"
          />
        </div>

        {/* Rejected Datasets */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="bg-red-500 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Rejected Datasets</h3>
            <p className="text-white opacity-90 text-sm">{rejectedTotal} datasets</p>
          </div>
          <DatasetList
            datasets={rejectedDatasets}
            loading={rejectedLoading}
            total={rejectedTotal}
            page={rejectedPage}
            onPageChange={setRejectedPage}
            type="rejected"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchTabOptimized;