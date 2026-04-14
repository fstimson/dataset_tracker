import React, { useState, useEffect } from 'react';
import { Upload, FileText, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { importAllData } from '../utils/csvImporter';

const DataImporter: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [counts, setCounts] = useState({ questions: 0, matches: 0 });

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    const [questionsRes, matchesRes] = await Promise.all([
      supabase.from('questions').select('id', { count: 'exact', head: true }),
      supabase.from('question_matches').select('id', { count: 'exact', head: true })
    ]);

    setCounts({
      questions: questionsRes.count || 0,
      matches: matchesRes.count || 0
    });
  };

  const handleImport = async () => {
    setImporting(true);
    setStatus('Importing data from CSV files...');

    try {
      const result = await importAllData();

      if (result.success) {
        setStatus(result.message);
        await loadCounts();
      } else {
        setStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      setStatus(`Error importing: ${error}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-bold text-white">Data Import</h3>
        </div>
        <button
          onClick={handleImport}
          disabled={importing}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>{importing ? 'Importing...' : 'Import CSV Data'}</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-200 text-sm font-medium">Automatic Import Available</p>
              <p className="text-blue-300 text-sm mt-1">
                Click the button above to import data from master list.csv and matching report.csv
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <FileText className="w-5 h-5 text-blue-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">Questions Data</h4>
            <p className="text-sm text-gray-300">From master list.csv</p>
            <div className="mt-3 flex items-center space-x-2">
              <div className="text-2xl font-bold text-white">{counts.questions}</div>
              <div className="text-xs text-gray-400">questions</div>
            </div>
          </div>

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <FileText className="w-5 h-5 text-green-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">Question Matches</h4>
            <p className="text-sm text-gray-300">From matching report.csv</p>
            <div className="mt-3 flex items-center space-x-2">
              <div className="text-2xl font-bold text-white">{counts.matches}</div>
              <div className="text-xs text-gray-400">matches</div>
            </div>
          </div>
        </div>
      </div>

      {status && (
        <div className={`mt-4 p-3 rounded-lg border text-sm ${
          status.includes('Error')
            ? 'bg-red-900/30 border-red-700 text-red-200'
            : 'bg-green-900/30 border-green-700 text-green-200'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default DataImporter;