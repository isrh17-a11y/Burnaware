import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MoodResponse, MoodActivity } from '@/lib/types';
import { CloudRain, Frown, Zap, Coffee, Meh, Smile, CheckCircle2, ArrowRight } from 'lucide-react';

interface MoodTrackerProps {
  userId: number;
  onActivityComplete: () => void; // To refresh points
}

type MoodCategory = 'sad' | 'angry' | 'anxious' | 'tired' | 'bored' | 'okay';

const MOODS: { id: MoodCategory; label: string; icon: any; color: string }[] = [
  { id: 'sad', label: 'Sad/Low', icon: CloudRain, color: 'text-[#4A4A4A] bg-[#4A4A4A]/10 border-[#4A4A4A]/20 hover:bg-[#4A4A4A]/20' },
  { id: 'angry', label: 'Angry', icon: Zap, color: 'text-[#AA4C0A] bg-[#AA4C0A]/10 border-[#AA4C0A]/20 hover:bg-[#AA4C0A]/20' },
  { id: 'anxious', label: 'Anxious', icon: Frown, color: 'text-[#763A12] bg-[#763A12]/10 border-[#763A12]/20 hover:bg-[#763A12]/20' },
  { id: 'tired', label: 'Tired', icon: Coffee, color: 'text-[#E08600] bg-[#E08600]/10 border-[#E08600]/20 hover:bg-[#E08600]/20' },
  { id: 'bored', label: 'Bored', icon: Meh, color: 'text-[#F5DE7A] bg-[#F5DE7A]/10 border-[#F5DE7A]/50 hover:bg-[#F5DE7A]/20 text-gray-800' },
  { id: 'okay', label: 'Okay+', icon: Smile, color: 'text-[#EFBF38] bg-[#EFBF38]/10 border-[#EFBF38]/20 hover:bg-[#EFBF38]/20 text-gray-800' },
];

export default function MoodTracker({ userId, onActivityComplete }: MoodTrackerProps) {
  const [step, setStep] = useState<'select' | 'reassure' | 'timer'>('select');
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);
  const [response, setResponse] = useState<MoodResponse | null>(null);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Timer State
  const [activeActivity, setActiveActivity] = useState<MoodActivity | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'timer' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'timer' && activeActivity) {
      // Timer Finished
      completeActivity(activeActivity);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft, activeActivity]);

  const handleMoodSelect = async (mood: MoodCategory) => {
    setSelectedMood(mood);
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const res = await fetch(`${API_URL}/api/mood/log/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood_category: mood })
      });
      if (res.ok) {
        setResponse(await res.json());
        setStep('reassure');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startActivity = (activity: MoodActivity) => {
    if (completedActivities.includes(activity.id)) return;
    setActiveActivity(activity);
    setTimeLeft(activity.duration_mins * 60); // Convert to seconds
    setStep('timer');
  };

  const cancelTimer = () => {
    setStep('reassure');
    setActiveActivity(null);
  };

  const completeActivity = async (activity: MoodActivity) => {
    try {
      // 🎉 Celebration!
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });

      setCompletedActivities(prev => [...prev, activity.id]);
      setStep('reassure'); // Go back to list
      setActiveActivity(null);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/mood/activity/${userId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: activity.title })
      });
      
      if (res.ok) {
        onActivityComplete(); // Refresh gamification points
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setStep('select');
    setSelectedMood(null);
    setResponse(null);
    setCompletedActivities([]);
    setActiveActivity(null);
  };

  return (
    <div className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-2xl rounded-3xl shadow-xl shadow-orange-900/10 p-6 animate-fadeIn transition-all duration-300 relative overflow-hidden border border-white/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-bold text-[#763A12] font-serif">
          {step === 'timer' ? 'Focus Mode' : 'How are you feeling?'}
        </h2>
        {step !== 'select' && step !== 'timer' && (
          <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600">
            Reset
          </button>
        )}
      </div>

      {step === 'select' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              disabled={loading}
              onClick={() => handleMoodSelect(mood.id)}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 backdrop-blur-md ${mood.color} ${loading ? 'opacity-50' : 'hover:shadow-lg hover:shadow-white/10'}`}
            >
              <mood.icon size={28} />
              <span className="font-medium text-sm font-serif">{mood.label}</span>
            </button>
          ))}
        </div>
      ) : step === 'timer' && activeActivity ? (
        <div className="flex flex-col items-center justify-center py-8 animate-fadeIn">
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
             {/* Simple SVG Circle Progress could go here, using text for now */}
             <div className="w-full h-full rounded-full border-8 border-indigo-50/50 flex items-center justify-center relative backdrop-blur-sm">
               <div className="text-4xl font-mono font-bold text-indigo-600">
                 {formatTime(timeLeft)}
               </div>
               {/* Pulse Animation */}
               <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-20"/>
             </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{activeActivity.title}</h3>
          <p className="text-gray-600 text-sm mb-8 text-center max-w-xs">{activeActivity.duration_mins} mins • Focus • Breathe</p>

          <button 
            onClick={cancelTimer}
            className="px-6 py-2 rounded-full bg-red-50/10 text-red-600 border border-red-200/50 hover:bg-red-50/20 backdrop-blur-sm transition-all shadow-sm"
          >
            Cancel Activity
          </button>
          
          {/* Debug/Skip Button for Testing */}
          <button 
             onClick={() => setTimeLeft(2)} 
             className="absolute bottom-2 right-2 text-xs text-gray-400 hover:text-gray-600"
          >
            skip
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-slideUp">
          {/* Reassurance */}
          <div className={`p-5 rounded-2xl border backdrop-blur-md ${MOODS.find(m => m.id === selectedMood)?.color.replace('text-', 'bg-opacity-20 border-').split(' ')[2] || 'border-blue-500/30'} ${MOODS.find(m => m.id === selectedMood)?.color.replace('text-', 'bg-').split(' ')[1] || 'bg-blue-50/10'}`}>
            <p className="text-gray-800 font-medium leading-relaxed text-lg text-center font-serif italic">
              &ldquo;{response?.reassurance_message}&rdquo;
            </p>
          </div>

          {/* Activities */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">Suggested for you ( +20 XP )</p>
            <div className="space-y-2">
              {response?.suggested_activities.map((activity) => {
                const isDone = completedActivities.includes(activity.id);
                return (
                  <div 
                    key={activity.id} 
                    onClick={() => !isDone && startActivity(activity)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer backdrop-blur-sm ${
                      isDone 
                        ? 'bg-green-50/40 border-green-200/50' 
                        : 'bg-white/40 border-white/40 hover:bg-white/60 hover:border-indigo-200/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isDone ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {isDone ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-400">{activity.duration_mins} mins</p>
                      </div>
                    </div>
                    {isDone && <span className="text-xs font-bold text-green-600 animate-pulse">+20 XP</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
