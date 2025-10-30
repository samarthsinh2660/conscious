import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Loader } from '../../../shared/components/Loader';
import { profileAPI } from '../../../api';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    selfIntroduction: '',
    goodQualities: '',
    badQualities: '',
    lifeGoals: '',
    challenges: '',
  });

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const data = await profileAPI.get();
      if (data.profile) {
        // Profile exists, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error checking profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await profileAPI.createOrUpdate(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Created!</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome! Let's Get to Know You
          </h1>
          <p className="text-gray-600">
            This helps us provide personalized insights for your journey
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Introduce Yourself
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={formData.selfIntroduction}
                onChange={(e) => setFormData({ ...formData, selfIntroduction: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Tell us about yourself, your background, interests, and what brings you here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What Are Your Good Qualities?
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={formData.goodQualities}
                onChange={(e) => setFormData({ ...formData, goodQualities: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="List your strengths, positive traits, and things you're proud of..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What Areas Would You Like to Improve?
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={formData.badQualities}
                onChange={(e) => setFormData({ ...formData, badQualities: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Be honest about areas where you'd like to grow or habits you'd like to change..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What Are Your Life Goals?
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={formData.lifeGoals}
                onChange={(e) => setFormData({ ...formData, lifeGoals: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Share your aspirations, dreams, and what you want to achieve..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What Challenges Are You Facing?
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="What obstacles or difficulties are you currently dealing with?..."
              />
            </div>

            <div className="pt-4">
              <Button type="submit" fullWidth size="lg" disabled={submitting}>
                {submitting ? 'Saving Profile...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
