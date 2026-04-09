import React, { useState, useEffect } from 'react';
import { Upload, FileText, Database, CheckCircle2, AlertCircle, LogIn, LogOut, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Question {
  id: string;
  tracker_file_name: string;
  question_number: number;
  question: string;
  status: string;
  issues: string;
}

interface QuestionMatch {
  id: string;
  tracker_file_name: string;
  question: string;
  question_match: string;
  matched_id: string;
  matched_tracker_file_name: string;
  status: string;
}

interface Timeline {
  tracker_file_name_current: string;
  final_status: string;
  period: string;
  status_current: string;
  notes: string;
}

const DataImporter: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [counts, setCounts] = useState({
    questions: 0,
    matches: 0,
    timeline: 0,
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || '');
      if (session) {
        loadCounts();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setUserEmail(session?.user?.email || '');
    if (session) {
      loadCounts();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: loginEmail,
          password: loginPassword,
        });
        if (error) throw error;
        setLoginError('Account created! You are now signed in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });
        if (error) throw error;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Login failed';
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStatus('');
  };

  const loadCounts = async () => {
    const [questionsRes, matchesRes, timelineRes] = await Promise.all([
      supabase.from('questions').select('id', { count: 'exact', head: true }),
      supabase.from('question_matches').select('id', { count: 'exact', head: true }),
      supabase.from('timeline').select('id', { count: 'exact', head: true }),
    ]);

    setCounts({
      questions: questionsRes.count || 0,
      matches: matchesRes.count || 0,
      timeline: timelineRes.count || 0,
    });
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
  };

  const handleMasterListUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatus('Importing master list...');

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const [, ...dataRows] = rows;

      const questions: Question[] = dataRows.map(row => ({
        id: row[4] || '',
        tracker_file_name: row[1] || '',
        question_number: parseInt(row[2]) || 0,
        question: row[5] || '',
        status: row[0] || '',
        issues: row[3] || ''
      })).filter(q => q.id && q.tracker_file_name);

      const { error } = await supabase
        .from('questions')
        .upsert(questions, { onConflict: 'id' });

      if (error) throw new Error(error.message);

      setStatus(`Successfully imported ${questions.length} questions!`);
      await loadCounts();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Error: ${msg}`);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const handleMatchingReportUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatus('Importing matching report...');

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const [, ...dataRows] = rows;

      const matches: QuestionMatch[] = dataRows.map(row => ({
        id: row[4] || '',
        tracker_file_name: row[0] || '',
        question: row[1] || '',
        question_match: row[2] || '',
        matched_id: row[5] || '',
        matched_tracker_file_name: row[6] || '',
        status: row[3] || ''
      })).filter(m => m.id && m.tracker_file_name);

      const { error } = await supabase
        .from('question_matches')
        .upsert(matches, { onConflict: 'id' });

      if (error) throw new Error(error.message);

      setStatus(`Successfully imported ${matches.length} question matches!`);
      await loadCounts();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Error: ${msg}`);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const handleTimelineUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatus('Importing timeline data...');

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const [, ...dataRows] = rows;

      const timeline: Timeline[] = dataRows.map(row => ({
        tracker_file_name_current: row[0] || '',
        final_status: row[1] || '',
        period: row[2] || '',
        status_current: row[3] || '',
        notes: row[4] || ''
      })).filter(t => t.tracker_file_name_current && t.period);

      const { error } = await supabase
        .from('timeline')
        .insert(timeline);

      if (error) throw new Error(error.message);

      setStatus(`Successfully imported ${timeline.length} timeline entries!`);
      await loadCounts();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Error: ${msg}`);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all imported data? This cannot be undone.')) {
      return;
    }

    setImporting(true);
    setStatus('Clearing all data...');

    try {
      await Promise.all([
        supabase.from('questions').delete().neq('id', ''),
        supabase.from('question_matches').delete().neq('id', ''),
        supabase.from('timeline').delete().neq('id', ''),
      ]);

      setStatus('All data cleared successfully!');
      await loadCounts();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Error: ${msg}`);
    } finally {
      setImporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="bg-gray-700 rounded-xl border border-gray-600 p-8 w-full max-w-md">
          <div className="flex items-center space-x-3 mb-6">
            <LogIn className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold text-white">
              {isSignUp ? 'Create Admin Account' : 'Admin Login'}
            </h3>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            {isSignUp
              ? 'Create an account to manage data imports.'
              : 'Sign in to access the data import tools.'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className={`text-sm p-3 rounded-lg ${
                loginError.includes('created') || loginError.includes('signed')
                  ? 'bg-green-900/30 border border-green-700 text-green-300'
                  : 'bg-red-900/30 border border-red-700 text-red-300'
              }`}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-colors text-sm"
            >
              {loginLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setLoginError(''); }}
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'No account? Create one'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-bold text-white">CSV Data Import</h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={handleClearAll}
            disabled={importing}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-200 text-sm font-medium">Upload CSV Files</p>
              <p className="text-blue-300 text-sm mt-1">
                Upload your CSV files below. Each upload will add or update records in the database.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <FileText className="w-5 h-5 text-blue-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">Master List</h4>
            <p className="text-sm text-gray-300 mb-3">Questions data</p>
            <div className="mb-3 flex items-center space-x-2">
              <div className="text-2xl font-bold text-white">{counts.questions}</div>
              <div className="text-xs text-gray-400">questions</div>
            </div>
            <label className="block">
              <div className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-center transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload CSV
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleMasterListUpload}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <FileText className="w-5 h-5 text-green-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">Matching Report</h4>
            <p className="text-sm text-gray-300 mb-3">Question matches</p>
            <div className="mb-3 flex items-center space-x-2">
              <div className="text-2xl font-bold text-white">{counts.matches}</div>
              <div className="text-xs text-gray-400">matches</div>
            </div>
            <label className="block">
              <div className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-center transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload CSV
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleMatchingReportUpload}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <FileText className="w-5 h-5 text-orange-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">Timeline</h4>
            <p className="text-sm text-gray-300 mb-3">Status history</p>
            <div className="mb-3 flex items-center space-x-2">
              <div className="text-2xl font-bold text-white">{counts.timeline}</div>
              <div className="text-xs text-gray-400">entries</div>
            </div>
            <label className="block">
              <div className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-center transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload CSV
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleTimelineUpload}
                disabled={importing}
                className="hidden"
              />
            </label>
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
