import React, { useState, useEffect } from 'react';
import { Database, Search, BarChart3, HelpCircle, FolderOpen, Clock, Upload } from 'lucide-react';
import { TabType } from './types';
import SearchTabOptimized from './components/SearchTabOptimized';
import SummaryTab from './components/SummaryTab';
import QuestionsTab from './components/QuestionsTab';
import DatasetsTab from './components/DatasetsTab';
import TimelineTab from './components/TimelineTab';
import DataImporter from './components/DataImporter';
import { useDataset } from './hooks/useDatasets';
import { supabase } from './lib/supabase';

function App() {
  const [selectedTab, setSelectedTab] = useState<TabType>('Search');
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ datasets: 0, events: 0 });

  useEffect(() => {
    async function loadStats() {
      const { count: datasetCount } = await supabase
        .from('cross reference')
        .select('*', { count: 'exact', head: true });

      const { count: eventCount } = await supabase
        .from('timeline')
        .select('*', { count: 'exact', head: true });

      setStats({
        datasets: datasetCount || 0,
        events: eventCount || 0
      });
    }

    loadStats();
  }, []);

  const { dataset: selectedDatasetData } = useDataset(selectedDataset);

  const tabConfig = [
    { key: 'Import', icon: Upload, label: 'Import Data', color: 'bg-blue-600 hover:bg-blue-700' },
    { key: 'Summary', icon: BarChart3, label: 'Summary', color: 'bg-gray-700 hover:bg-gray-800' },
    { key: 'Questions', icon: HelpCircle, label: 'Questions', color: 'bg-gray-500 hover:bg-gray-600' },
    { key: 'Datasets', icon: FolderOpen, label: 'Datasets', color: 'bg-gray-400 hover:bg-gray-500' },
    { key: 'Timeline', icon: Clock, label: 'Timeline', color: 'bg-orange-500 hover:bg-orange-600' },
    { key: 'Search', icon: Search, label: 'Search', color: 'bg-red-500 hover:bg-red-600' }
  ] as const;

  const handleSelectDataset = (dataset: string) => {
    setSelectedDataset(dataset);
    // Auto-switch to Summary tab when dataset is selected from Search
    if (selectedTab === 'Search') {
      setSelectedTab('Summary');
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Import':
        return <DataImporter />;
      case 'Search':
        return (
          <SearchTabOptimized
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectDataset={handleSelectDataset}
            selectedDataset={selectedDataset}
          />
        );
      case 'Summary':
        return (
          <SummaryTab
            selectedDataset={selectedDataset}
            dataset={selectedDatasetData}
          />
        );
      case 'Questions':
        return (
          <QuestionsTab
            selectedDataset={selectedDataset}
          />
        );
      case 'Datasets':
        return (
          <DatasetsTab
            onSelectDataset={handleSelectDataset}
          />
        );
      case 'Timeline':
        return (
          <TimelineTab
            selectedDataset={selectedDataset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-white">Dataset Tracker</h1>
            </div>
            
            {selectedDataset && (
              <div className="hidden md:block">
                <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium border border-gray-600">
                  Selected: {selectedDataset.length > 40 
                    ? `${selectedDataset.substring(0, 40)}...` 
                    : selectedDataset
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex justify-center space-x-1 flex-1">
            {tabConfig.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as TabType)}
                  className={`
                    flex items-center space-x-2 px-6 py-2 rounded-lg text-white font-medium
                    transition-all duration-200 border border-gray-600
                    ${selectedTab === tab.key 
                      ? `${tab.color}` 
                      : `${tab.color.replace('hover:', '')} opacity-70 hover:opacity-100`
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>
            
            {/* Search Input */}
            <div className="ml-6 flex-shrink-0" style={{ minWidth: '300px' }}>
              <div className="flex items-center space-x-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search datasets by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-400">
              <Database className="w-4 h-4" />
              <span className="text-sm">Dataset Tracker v2.0</span>
            </div>
            <div className="text-sm text-gray-400">
              {stats.datasets} datasets • {stats.events} events
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;