import { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { Loader } from '../../../shared/components/Loader';
import { Modal } from '../../../shared/components/Modal';
import { ReflectionCard } from '../components/ReflectionCard';
import { AnalysisCard } from '../components/AnalysisCard';
import { reflectionAPI, analysisAPI } from '../../../api';

export const ReflectionsPage = () => {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await loadReflections(isMounted);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadReflections = async (isMounted = true) => {
    setLoading(true);
    try {
      const data = await reflectionAPI.getAll({ limit: 30 });
      if (isMounted) {
        setReflections(data.reflections);
      }
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleViewDetails = async (reflection) => {
    setSelectedReflection(reflection);
    setShowDetailModal(true);
    setAnalysisLoading(true);
    
    try {
      const data = await analysisAPI.getByReflectionId(reflection.id);
      setSelectedAnalysis(data.analysis);
    } catch (error) {
      console.error('Error loading analysis:', error);
      setSelectedAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Reflections</h1>
          </div>
          <p className="text-gray-600">
            Review your past reflections and track your journey
          </p>
        </div>

        {/* Reflections Grid */}
        {reflections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No reflections yet
            </h3>
            <p className="text-gray-600">
              Start your journey by completing your first daily reflection
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reflections.map((reflection) => (
              <ReflectionCard
                key={reflection.id}
                reflection={reflection}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedReflection(null);
          setSelectedAnalysis(null);
        }}
        title={selectedReflection ? formatDate(selectedReflection.reflectionDate) : 'Reflection Details'}
        size="xl"
      >
        {selectedReflection && (
          <div className="space-y-6">
            {/* Reflection Details */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How was your day?</h4>
                <p className="text-gray-700">{selectedReflection.daySummary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Social Media Usage</h4>
                <p className="text-gray-700">{selectedReflection.socialMediaTime}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Truthfulness & Kindness</h4>
                <p className="text-gray-700">{selectedReflection.truthfulnessKindness}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Conscious Actions</h4>
                <p className="text-gray-700">{selectedReflection.consciousActions}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Overthinking/Stress</h4>
                <p className="text-gray-700">{selectedReflection.overthinkingStress}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Gratitude Expression</h4>
                <p className="text-gray-700">{selectedReflection.gratitudeExpression}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Proud Moment</h4>
                <p className="text-gray-700">{selectedReflection.proudMoment}</p>
              </div>
            </div>

            {/* AI Analysis */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Insights</h3>
              {analysisLoading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
                  <div className="text-center">
                    <Loader size="lg" />
                    <p className="text-gray-600 mt-4">Loading insights...</p>
                  </div>
                </div>
              ) : (
                <AnalysisCard analysis={selectedAnalysis} />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
