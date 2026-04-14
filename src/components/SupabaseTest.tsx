import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database, CheckCircle, XCircle, AlertCircle, Columns } from 'lucide-react';

interface TestResult {
  table: string;
  status: 'success' | 'error' | 'testing';
  count?: number;
  error?: string;
  sampleData?: any[];
  columns?: string[];
  expectedColumns?: string[];
  columnMismatches?: string[];
}

const SupabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [connectionError, setConnectionError] = useState<string>('');
  const [showColumnTest, setShowColumnTest] = useState(false);

  const tables = [
    'cross reference',
    'master list', 
    'matching report',
    'timeline'
  ];

  // Expected columns based on our code
  const expectedColumns = {
    'cross reference': [
      'tracker_file_name_current', 'status_current', 'ds_rate', 'date_sent', 
      'rejection_date', 'reason_for_rejection', 'date_of_appeal', 
      'date_of_appeal_rejection', 'reason_for_appeal_rejection', 'reason_for_rejection_3'
    ],
    'master list': [
      'id', 'tracker_file_name_current', 'status_current', 'question_number', 
      'question_current', 'issues'
    ],
    'matching report': [
      'id', 'tracker_file_name_current', 'status_current', 'question_current', 
      'question_match', 'matched_id', 'matched_tracker_file_name'
    ],
    'timeline': [
      'period', 'status_current', 'tracker_file_name_current', 'final_status', 'notes'
    ]
  };
  useEffect(() => {
    runConnectionTest();
  }, []);

  const runConnectionTest = async () => {
    console.log('🔍 Starting Supabase connection test...');
    
    // Test RLS policies
    console.log('🔒 Testing RLS policies...');
    
    // First test cross reference table specifically since it has the new policy
    console.log('🔍 Testing cross reference table with new RLS policy...');
    try {
      const { data: testData, count: testCount, error: testError } = await supabase
        .from('cross reference')
        .select('*', { count: 'exact' })
        .limit(5);
      
      console.log('📊 Cross reference test result:', { testData, testCount, testError });
      
      if (testError) {
        console.error('❌ Cross reference still blocked:', testError);
      } else {
        console.log('✅ Cross reference accessible! Found', testCount, 'rows');
      }
    } catch (error) {
      console.error('❌ Cross reference test failed:', error);
    }
    
    // Test basic connection
    try {
      const { data, error } = await supabase.from('cross reference').select('*', { count: 'exact', head: true });
      if (error) throw error;
      setConnectionStatus('success');
      console.log('✅ Basic connection successful');
    } catch (error) {
      setConnectionStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Unknown connection error';
      setConnectionError(errorMsg);
      console.error('❌ Connection failed:', error);
      
      // Check if it's an RLS issue
      if (errorMsg.includes('RLS') || errorMsg.includes('policy') || errorMsg.includes('permission')) {
        console.error('🔒 This appears to be a Row Level Security (RLS) issue!');
      }
      
      return;
    }

    // Test each table
    const results: TestResult[] = [];
    
    for (const table of tables) {
      console.log(`🔍 Testing table: ${table}`);
      
      try {
        const { data, count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(3);

        if (error) throw error;

        // Get column names from the first row
        const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
        const expected = expectedColumns[table] || [];
        const columnMismatches = expected.filter(col => !columns.includes(col));
        results.push({
          table,
          status: 'success',
          count: count || 0,
          sampleData: data || [],
          columns,
          expectedColumns: expected,
          columnMismatches
        });
        
        console.log(`✅ ${table}: ${count} rows found`);
      } catch (error) {
        results.push({
          table,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        console.error(`❌ ${table} failed:`, error);
      }
    }
    
    setTestResults(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Database className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-white">Supabase Connection Test</h2>
        <button
          onClick={runConnectionTest}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Retest
        </button>
        <button
          onClick={() => setShowColumnTest(!showColumnTest)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showColumnTest ? 'Hide' : 'Show'} Column Test
        </button>
      </div>

      {/* Connection Status */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          {getStatusIcon(connectionStatus)}
          <span className="ml-2">Basic Connection</span>
        </h3>
        
        {connectionStatus === 'success' && (
          <div className="text-green-400">
            ✅ Successfully connected to Supabase
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="text-red-400">
            ❌ Connection failed: {connectionError}
          </div>
        )}
        
        {connectionStatus === 'testing' && (
          <div className="text-yellow-400">
            🔍 Testing connection...
          </div>
        )}
      </div>

      {/* Table Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testResults.map((result) => (
          <div key={result.table} className="bg-gray-700 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              {getStatusIcon(result.status)}
              <span className="ml-2">{result.table}</span>
            </h4>
            
            {result.status === 'success' && (
              <div className="space-y-2">
                <div className="text-green-400">
                  ✅ Table accessible
                </div>
                <div className="text-white">
                  <strong>Row count:</strong> {result.count}
                </div>
                
                {showColumnTest && result.columns && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Columns className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-semibold">Column Analysis</span>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-gray-300">
                        <strong>Actual columns ({result.columns.length}):</strong>
                      </p>
                      <div className="bg-gray-800 p-2 rounded mt-1">
                        {result.columns.map(col => (
                          <span key={col} className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-xs mr-1 mb-1">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-gray-300">
                        <strong>Expected by code ({result.expectedColumns?.length || 0}):</strong>
                      </p>
                      <div className="bg-gray-800 p-2 rounded mt-1">
                        {result.expectedColumns?.map(col => (
                          <span key={col} className={`inline-block px-2 py-1 rounded text-xs mr-1 mb-1 ${
                            result.columns?.includes(col) 
                              ? 'bg-green-600 text-white' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {result.columnMismatches && result.columnMismatches.length > 0 && (
                      <div className="bg-red-900 border border-red-600 rounded p-3">
                        <p className="text-red-300 font-semibold">
                          ❌ Missing columns ({result.columnMismatches.length}):
                        </p>
                        <div className="mt-1">
                          {result.columnMismatches.map(col => (
                            <span key={col} className="inline-block bg-red-700 text-white px-2 py-1 rounded text-xs mr-1">
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.columnMismatches && result.columnMismatches.length === 0 && (
                      <div className="bg-green-900 border border-green-600 rounded p-3">
                        <p className="text-green-300 font-semibold">
                          ✅ All expected columns found!
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {result.sampleData && result.sampleData.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-gray-300 cursor-pointer hover:text-white">
                      View sample data ({result.sampleData.length} rows)
                    </summary>
                    <pre className="text-xs text-gray-300 mt-2 p-3 bg-gray-800 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.sampleData, null, 2)}
                    </pre>
                  </details>
                )}
                
                {result.count === 0 && (
                  <div className="text-yellow-400 mt-2">
                    ⚠️ Table is empty - this might be why you're seeing sample data
                  </div>
                )}
              </div>
            )}
            
            {result.status === 'error' && (
              <div className="text-red-400">
                ❌ Error: {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Environment Variables Check */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Environment Variables</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">VITE_SUPABASE_URL:</span>
            <span className="text-white font-mono">
              {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">VITE_SUPABASE_ANON_KEY:</span>
            <span className="text-white font-mono">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
            </span>
          </div>
          
          <div className="mt-4 p-3 bg-gray-800 rounded">
            <div className="text-xs text-gray-300">
              <div>Current URL: {import.meta.env.VITE_SUPABASE_URL || 'Using fallback'}</div>
              <div>Current Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Using fallback'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;