'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { AssessmentData } from '@/lib/types';
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';

const questions = [
  {
    id: 'stress_level',
    label: 'How would you rate your current stress level?',
    description: 'On a scale of 1-10, with 10 being extremely stressed',
    min: 1,
    max: 10,
  },
  {
    id: 'work_hours',
    label: 'How many hours do you work/study per day?',
    description: 'Include both work and study time',
    min: 0,
    max: 24,
  },
  {
    id: 'sleep_hours',
    label: 'How many hours of sleep do you get per night?',
    description: 'Average hours of sleep',
    min: 0,
    max: 12,
  },
  {
    id: 'physical_activity',
    label: 'How many hours of physical activity per week?',
    description: 'Exercise, sports, or active movement',
    min: 0,
    max: 20,
  },
  {
    id: 'social_support',
    label: 'How would you rate your social support system?',
    description: 'On a scale of 1-10, with 10 being excellent support',
    min: 1,
    max: 10,
  },
  {
    id: 'work_life_balance',
    label: 'How would you rate your work-life balance?',
    description: 'On a scale of 1-10, with 10 being perfectly balanced',
    min: 1,
    max: 10,
  },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AssessmentData>({
    stress_level: 5,
    work_hours: 8,
    sleep_hours: 7,
    physical_activity: 3,
    social_support: 5,
    work_life_balance: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(storedUser);
      
      // Handle both id formats (backend returns user_id, enriched returns id)
      const userId = user.id || user.user_id;

      if (!userId) {
        console.error('User ID missing from storage:', user);
        setError('User session invalid. Please log out and log in again.');
        setLoading(false);
        return;
      }
      
      const result = await ApiClient.submitAssessment(formData, userId);
      localStorage.setItem('latestAssessment', JSON.stringify(result));
      router.push('/dashboard');
    } catch (err) {
      console.error('Assessment submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit assessment');
      setLoading(false);
    }
  };

  const handleValueChange = (value: number) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value,
    });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#F5DE7A,#F2EEEC,#EFBF38,#E08600)] p-4 min-h-screen bg-fixed">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Burnout Assessment</h1>
          <p className="text-gray-700 font-medium">Help us understand your current wellness state</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-800">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-[#763A12]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-[#F2EEEC]/60 rounded-full h-2 border border-[#763A12]/10">
            <div
              className="bg-gradient-to-r from-[#AA4C0A] to-[#E08600] h-2 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-8 mb-6 animate-fadeIn border border-[#763A12]/10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#763A12] mb-2">{currentQuestion.label}</h2>
            <p className="text-[#763A12]/70">{currentQuestion.description}</p>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-5xl font-bold text-[#E08600]">
                {formData[currentQuestion.id as keyof AssessmentData]}
              </div>
            </div>
            <input
              type="range"
              min={currentQuestion.min}
              max={currentQuestion.max}
              value={formData[currentQuestion.id as keyof AssessmentData]}
              onChange={(e) => handleValueChange(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #AA4C0A 0%, #E08600 ${
                  ((formData[currentQuestion.id as keyof AssessmentData] - currentQuestion.min) /
                    (currentQuestion.max - currentQuestion.min)) *
                  100
                }%, #E5E7EB ${
                  ((formData[currentQuestion.id as keyof AssessmentData] - currentQuestion.min) /
                    (currentQuestion.max - currentQuestion.min)) *
                  100
                }%, #E5E7EB 100%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{currentQuestion.min}</span>
              <span>{currentQuestion.max}</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {currentStep === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : (
                <>
                  <CheckCircle size={20} />
                  Complete Assessment
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Next
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Skip to Dashboard */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--primary);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--primary);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
