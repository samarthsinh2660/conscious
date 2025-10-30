import { useState, useEffect, useRef } from 'react';
import { PlusCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Modal } from '../../../shared/components/Modal';
import { Loader } from '../../../shared/components/Loader';
import { DailyReflectionForm } from '../components/DailyReflectionForm';
import { AnalysisCard } from '../components/AnalysisCard';
import { reflectionAPI, analysisAPI } from '../../../api';

export const DashboardPage = () => {
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [todayReflectionExists, setTodayReflectionExists] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await loadDashboardData();
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [reflectionData, analysisData] = await Promise.all([
        reflectionAPI.checkToday(),
        analysisAPI.getLatest(),
      ]);
      
      setTodayReflectionExists(reflectionData.exists);
      setLatestAnalysis(analysisData.analysis);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReflectionSuccess = async () => {
    setShowReflectionModal(false);
    setTodayReflectionExists(true);
    setAnalysisLoading(true);
    
    // Poll for AI analysis with retries
    const pollForAnalysis = async (attempts = 0, maxAttempts = 10) => {
      try {
        const analysisData = await analysisAPI.getLatest();
        
        if (analysisData.analysis) {
          setLatestAnalysis(analysisData.analysis);
          setAnalysisLoading(false);
          return;
        }
        
        // If no analysis yet and haven't exceeded max attempts, try again
        if (attempts < maxAttempts) {
          setTimeout(() => pollForAnalysis(attempts + 1, maxAttempts), 3000);
        } else {
          // Max attempts reached, stop loading
          setAnalysisLoading(false);
        }
      } catch (error) {
        console.error('Error loading analysis:', error);
        
        // Retry on error if haven't exceeded max attempts
        if (attempts < maxAttempts) {
          setTimeout(() => pollForAnalysis(attempts + 1, maxAttempts), 3000);
        } else {
          setAnalysisLoading(false);
        }
      }
    };
    
    // Start polling after a brief delay to allow backend to start processing
    setTimeout(() => pollForAnalysis(), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600">
            Track your daily reflections and gain insights into your personal growth
          </p>
        </div>

        {/* Daily Reflection Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Daily Reflection</h2>
              <p className="text-indigo-100 mb-4">
                {todayReflectionExists
                  ? 'You have completed today\'s reflection. Great job!'
                  : 'Take a moment to reflect on your day and gain valuable insights'}
              </p>
              {todayReflectionExists ? (
                <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Completed for today</span>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowReflectionModal(true)}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Start Daily Reflection
                </Button>
              )}
            </div>
            <Sparkles className="w-24 h-24 opacity-20" />
          </div>
        </div>

        {/* Latest Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Latest AI Insights
          </h2>
          {analysisLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
              <div className="text-center">
                <Loader size="lg" />
                <p className="text-gray-600 mt-4">Generating your personalized insights...</p>
                <p className="text-gray-500 text-sm mt-2">This may take 15-30 seconds...</p>
              </div>
            </div>
          ) : (
            <AnalysisCard analysis={latestAnalysis} isLoading={false} />
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Current Streak</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {todayReflectionExists ? '1' : '0'} day
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Reflections</h3>
            <p className="text-3xl font-bold text-purple-600">
              {todayReflectionExists ? '1+' : '0'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Growth Score</h3>
            <p className="text-3xl font-bold text-green-600">Growing</p>
          </div>
        </div>
      </div>

      {/* Daily Reflection Modal */}
      <Modal
        isOpen={showReflectionModal}
        onClose={() => setShowReflectionModal(false)}
        title="Daily Reflection"
        size="lg"
      >
        <DailyReflectionForm
          onSuccess={handleReflectionSuccess}
          onCancel={() => setShowReflectionModal(false)}
        />
      </Modal>
    </div>
  );
};
