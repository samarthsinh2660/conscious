import { Sparkles, Target, Heart } from 'lucide-react';

export const AnalysisCard = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-gray-500 text-center">No analysis available yet. Submit your daily reflection to get personalized insights!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis */}
      {analysis.analysisText && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-200">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Analysis</h3>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {analysis.analysisText}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {analysis.recommendations}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {analysis.motivationalMessage && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm p-6 border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Motivational Message</h3>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {analysis.motivationalMessage}
          </div>
        </div>
      )}
    </div>
  );
};
