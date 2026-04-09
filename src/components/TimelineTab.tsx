import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import StatusIcon from './StatusIcon';
import StatusBadge from './StatusBadge';
import { datasetService } from '../lib/supabase';

interface TimelineTabProps {
  selectedDataset: string | null;
}

const TimelineTab: React.FC<TimelineTabProps> = ({ selectedDataset }) => {
  const [timelineData, setTimelineData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const { data } = await datasetService.getTimeline(selectedDataset);
        setTimelineData(data || []);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [selectedDataset]);

  const formatTimelineDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Loading Timeline...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-white">Timeline Overview</h2>
        </div>
        
        {selectedDataset && (
          <div className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg text-sm font-medium">
            Filtered by: {selectedDataset}
          </div>
        )}
      </div>

      {/* Timeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 text-center">
          <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{timelineData.length}</p>
          <p className="text-sm text-gray-400">Total Events</p>
        </div>
        
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {timelineData.filter(t => t.status_current && t.status_current.includes('Approved')).length}
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {timelineData.filter(t => t.status_current && t.status_current.includes('Approved')).length}
          </p>
          <p className="text-sm text-gray-400">Approved</p>
        </div>
        
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 text-center">
          <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {timelineData.filter(t => t.status_current && t.status_current.includes('Rejected')).length}
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {timelineData.filter(t => t.status_current && t.status_current.includes('Rejected')).length}
          </p>
          <p className="text-sm text-gray-400">Rejected</p>
        </div>
      </div>

      {/* Timeline Table */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Dataset
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {timelineData.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-600 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-white">
                        📅 {formatTimelineDate(entry.period)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <StatusIcon status={entry.status_current} size={20} />
                      <StatusBadge status={entry.status_current} />
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white max-w-xs truncate">
                      {entry.dataset_filename}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 max-w-sm">
                      {entry.notes}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {timelineData.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 inline-block">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2">No Timeline Data</h3>
            <p className="text-gray-300">
              {selectedDataset 
                ? `No timeline events found for "${selectedDataset}"` 
                : 'No timeline data available'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineTab;