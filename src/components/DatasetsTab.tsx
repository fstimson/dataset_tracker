import React from 'react';
import { FolderOpen, Filter } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import StatusIcon from './StatusIcon';
import StatusBadge from './StatusBadge';
import { useDatasets } from '../hooks/useDatasets';

interface DatasetsTabProps {
  onSelectDataset: (dataset: string) => void;
}

const DatasetsTab: React.FC<DatasetsTabProps> = ({ onSelectDataset }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 500; // Increased from 100 to 500
  const [filterStatus, setFilterStatus] = React.useState<string>('ALL');
  const { datasets, loading, totalCount, debugInfo } = useDatasets(currentPage, pageSize, '', filterStatus);
  
  const statusCounts = React.useMemo(() => {
    return datasets.reduce((acc, dataset) => {
      const status = dataset.status_current || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [datasets]);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Loading Datasets...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderOpen className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-white">All Datasets ({totalCount} total)</h2>
        </div>
        
        {/* Filter dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="ALL">All Status ({datasets.length})</option>
            {Object.entries(statusCounts).map(([status, count]) => (
              <option key={status} value={status}>
                {status} ({count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <StatusIcon status={status} size={24} />
            <p className="text-2xl font-bold text-white mt-2">{count}</p>
            <p className="text-xs text-gray-400 truncate">{status}</p>
          </div>
        ))}
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <div
            key={dataset.id || dataset.tracker_file_name_current}
            className="bg-gray-700 border border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
            onClick={() => onSelectDataset(dataset.tracker_file_name_current)}
          >
            {/* Header with status */}
            <div className="px-6 py-4 bg-gray-800 border-b border-gray-600">
              <div className="flex items-center justify-between">
                <StatusIcon status={dataset.status_current} />
                <StatusBadge status={dataset.status_current} />
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h3 className="font-semibold text-white mb-3 line-clamp-2 leading-tight">
                {dataset.tracker_file_name_current}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span className="font-semibold text-green-600">${dataset.ds_rate || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Submitted:</span>
                  <span>{formatDate(dataset.date_sent)}</span>
                </div>
                
                {dataset.rejection_date && (
                  <div className="flex justify-between">
                    <span>Rejected:</span>
                    <span className="text-red-400">{formatDate(dataset.rejection_date)}</span>
                  </div>
                )}

                {dataset.report_description && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-400">Description:</span>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">{dataset.report_description}</p>
                  </div>
                )}
              </div>
              
              {/* Quick actions */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-lg p-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
          >
            Previous
          </button>
          
          <span className="text-white font-medium">
            Page {currentPage} of {totalPages} • Showing {datasets.length} of {totalCount} datasets
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
          >
            Next
          </button>
        </div>
      )}

      {datasets.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2">No Datasets Found</h3>
            <p className="text-gray-300">
              {filterStatus === 'ALL' 
                ? 'No datasets returned from Supabase. Check the debug info below.' 
                : `No datasets found with status "${filterStatus}"`
              }
            </p>
          </div>
        </div>
      )}

      {/* Debug info */}
      <div className="mt-4 p-4 bg-gray-800 border border-gray-600 rounded-lg">
        <h4 className="text-white font-semibold mb-2">🔧 Debug Info:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-300">Total datasets displayed: <span className="text-green-400">{datasets.length}</span></p>
            <p className="text-gray-300">Filter status: <span className="text-blue-400">{filterStatus}</span></p>
            <p className="text-gray-300">Using fallback data: <span className={debugInfo?.usingFallback ? "text-red-400" : "text-green-400"}>{debugInfo?.usingFallback ? "YES" : "NO"}</span></p>
          </div>
          <div>
            <p className="text-gray-300">Supabase count: <span className="text-yellow-400">{debugInfo?.supabaseCount || 0}</span></p>
            <p className="text-gray-300">Supabase data length: <span className="text-yellow-400">{debugInfo?.supabaseData?.length || 0}</span></p>
            {debugInfo?.supabaseError && (
              <p className="text-red-400">Error: {debugInfo.supabaseError.message}</p>
            )}
          </div>
        </div>
        
        {debugInfo && (
          <details className="mt-3">
            <summary className="text-gray-400 cursor-pointer">Full debug data</summary>
            <pre className="text-xs text-gray-300 mt-2 overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
        
        {datasets.length > 0 && (
          <details className="mt-3">
            <summary className="text-gray-400 cursor-pointer">First dataset structure</summary>
            <pre className="text-xs text-gray-300 mt-2 overflow-auto max-h-40">
              {JSON.stringify(datasets[0], null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default DatasetsTab;