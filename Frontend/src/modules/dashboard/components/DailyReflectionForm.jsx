import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { reflectionAPI } from '../../../api';

export const DailyReflectionForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    daySummary: '',
    socialMediaTime: '',
    truthfulnessKindness: '',
    consciousActions: '',
    overthinkingStress: '',
    gratitudeExpression: '',
    proudMoment: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const questions = [
    {
      key: 'daySummary',
      label: 'How was your day?',
      placeholder: 'Describe briefly or in one word...',
      rows: 2,
    },
    {
      key: 'socialMediaTime',
      label: 'How much time did you spend on social media, and how did it make you feel?',
      placeholder: 'Be honest about your usage and feelings...',
      rows: 3,
    },
    {
      key: 'truthfulnessKindness',
      label: 'Were you truthful and kind or lied and used harsh words?',
      placeholder: 'Describe in detail about the event and reaction...',
      rows: 3,
    },
    {
      key: 'consciousActions',
      label: 'Did you act consciously or react impulsively today?',
      placeholder: 'Describe the event and reaction...',
      rows: 3,
    },
    {
      key: 'overthinkingStress',
      label: 'Did you overthink or stress about something? If yes, what was it?',
      placeholder: 'Share what was on your mind...',
      rows: 3,
    },
    {
      key: 'gratitudeExpression',
      label: 'Did you express gratitude for what you have or to someone who made your day?',
      placeholder: 'Who or what are you grateful for today?...',
      rows: 3,
    },
    {
      key: 'proudMoment',
      label: 'What is one thing you are proud of doing today?',
      placeholder: 'Celebrate your achievement, big or small...',
      rows: 3,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await reflectionAPI.create(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit reflection. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-lg">
        <p className="text-sm">
          Take a moment to reflect on your day. Be honest with yourself - this is your personal space for growth.
        </p>
      </div>

      {questions.map((question, index) => (
        <div key={question.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {index + 1}. {question.label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            required
            value={formData[question.key]}
            onChange={(e) => setFormData({ ...formData, [question.key]: e.target.value })}
            rows={question.rows}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder={question.placeholder}
          />
        </div>
      ))}

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Reflection'}
        </Button>
      </div>
    </form>
  );
};
