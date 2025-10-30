import { Calendar, Eye } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const ReflectionCard = ({ reflection, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">
            {formatDate(reflection.reflectionDate)}
          </h3>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Day Summary:</p>
          <p className="text-gray-800 line-clamp-2">{reflection.daySummary}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Proud Moment:</p>
          <p className="text-gray-800 line-clamp-2">{reflection.proudMoment}</p>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        fullWidth
        onClick={() => onViewDetails(reflection)}
      >
        <Eye className="w-4 h-4 mr-2" />
        View Details & Analysis
      </Button>
    </div>
  );
};
