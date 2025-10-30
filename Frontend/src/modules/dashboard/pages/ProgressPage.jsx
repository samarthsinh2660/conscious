import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { Loader } from '../../../shared/components/Loader';
import { reflectionAPI, analysisAPI } from '../../../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ProgressPage = () => {
  const [reflections, setReflections] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await loadProgressData(isMounted);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadProgressData = async (isMounted = true) => {
    setLoading(true);
    try {
      const [reflectionData, analysisData] = await Promise.all([
        reflectionAPI.getAll({ limit: 30 }),
        analysisAPI.getAll({ limit: 30 }),
      ]);
      
      if (isMounted) {
        setReflections(reflectionData.reflections);
        setAnalyses(analysisData.analyses);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const chartData = reflections.slice(0, 7).reverse().map((reflection, index) => ({
    date: new Date(reflection.reflectionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    reflections: index + 1,
  }));

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
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          </div>
          <p className="text-gray-600">
            Visualize your journey and celebrate your growth
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <Calendar className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Reflections</h3>
            <p className="text-4xl font-bold">{reflections.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <Award className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-sm font-medium opacity-90 mb-1">AI Insights Received</h3>
            <p className="text-4xl font-bold">{analyses.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-sm font-medium opacity-90 mb-1">Days Active</h3>
            <p className="text-4xl font-bold">{reflections.length}</p>
          </div>
        </div>

        {/* Chart */}
        {reflections.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Reflection Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reflections" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Insights</h2>
          {analyses.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No insights yet. Complete your daily reflections to receive personalized guidance.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.slice(0, 5).map((analysis) => (
                <div key={analysis.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">
                      {new Date(analysis.reflectionDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="text-gray-700 line-clamp-2">{analysis.daySummary}</p>
                  {analysis.motivationalMessage && (
                    <p className="text-sm text-indigo-600 mt-2 italic line-clamp-1">
                      {analysis.motivationalMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
