import React from 'react';
import { Search } from 'lucide-react';
import { Dataset } from '../types';

interface SearchTabProps {
  datasets: Dataset[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectDataset: (dataset: string) => void;
  selectedDataset: string | null;
}

const SearchTab: React.FC<SearchTabProps> = ({
  datasets,
  searchQuery,
  onSearchChange,
  onSelectDataset,
  selectedDataset
}) => {
  const filteredApproved = datasets.filter(dataset => 
    dataset.status === 'APPROVED' && 
    dataset.trackerFileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRejected = datasets.filter(dataset => 
    dataset.status === 'REJECTED' && 
    dataset.trackerFileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Search className="w-6 h-6 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-800">Search Datasets</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approved Datasets */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="bg-orange-500 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Approved Datasets</h3>
            <p className="text-white opacity-90 text-sm">{filteredApproved.length} datasets</p>
          </div>
          <div className="max-h-96 overflow-y-auto bg-gray-900">
            {filteredApproved.length > 0 ? (
              filteredApproved.map((dataset) => (
                <button
                  key={dataset.id}
                  onClick={() => onSelectDataset(dataset.trackerFileName)}
                  className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700 last:border-b-0 ${
                    selectedDataset === dataset.trackerFileName ? 'bg-gray-700 border-l-4 border-l-green-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-green-500 text-lg">🟢</div>
                    <span className="text-white font-medium">{dataset.trackerFileName}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-400 ml-8">
                    Rate: ${dataset.rate} • Submitted: {dataset.dateSubmitted}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p>No approved datasets found</p>
              </div>
            )}
          </div>
        </div>

        {/* Rejected Datasets */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="bg-red-500 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Rejected Datasets</h3>
            <p className="text-white opacity-90 text-sm">{filteredRejected.length} datasets</p>
          </div>
          <div className="max-h-96 overflow-y-auto bg-gray-900">
            {filteredRejected.length > 0 ? (
              filteredRejected.map((dataset) => (
                <button
                  key={dataset.id}
                  onClick={() => onSelectDataset(dataset.trackerFileName)}
                  className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700 last:border-b-0 ${
                    selectedDataset === dataset.trackerFileName ? 'bg-gray-700 border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-red-500 text-lg">❌</div>
                    <span className="text-white font-medium">{dataset.trackerFileName}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-400 ml-8">
                    Rate: ${dataset.rate} • Rejected: {dataset.rejectionDate}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p>No rejected datasets found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredApproved.length === 0 && filteredRejected.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 inline-block">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-300 font-medium">No datasets found matching "{searchQuery}"</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTab;