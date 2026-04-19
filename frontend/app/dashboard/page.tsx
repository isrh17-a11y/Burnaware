'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BurnoutScoreCard from '@/components/BurnoutScoreCard';
import BurnoutChart from '@/components/BurnoutChart';
import SleepStressChart from '@/components/SleepStressChart';
import HistoryTable from '@/components/HistoryTable';
import ChatbotPanel from '@/components/ChatbotPanel';
import GamificationCard from '@/components/GamificationCard';
import GoalTracker from '@/components/GoalTracker';
import MoodTracker from '@/components/MoodTracker';
import DailyQuote from '@/components/DailyQuote';
import ScoreUpgradeModal from '@/components/ScoreUpgradeModal';
import { BurnoutHistory, User, GamificationProfile, Goal } from '@/lib/types';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  Activity,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [burnoutScore, setBurnoutScore] = useState(45);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [previousScore, setPreviousScore] = useState(0);

  // Real data state
  const [chartData, setChartData] = useState<BurnoutHistory[]>([]);
  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Modal state
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreModalData, setScoreModalData] = useState({
    pointsEarned: 0,
    previousScore: 0,
    newScore: 0,
  });

  const handleActivityComplete = async (pointsEarned: number = 20) => {
    if (!user) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
    
    // Store previous score
    const prevScore = gamificationProfile?.points || 0;
    
    // Refresh goals and profile
    const goalsRes = await fetch(`${API_URL}/api/gamification/goals/${user.id}`);
    if (goalsRes.ok) {
      setGoals(await goalsRes.json());
    }
    
    const profileRes = await fetch(`${API_URL}/api/gamification/profile/${user.id}`);
    if (profileRes.ok) {
      const newProfile = await profileRes.json();
      setGamificationProfile(newProfile);
      
      // Show modal with score upgrade
      setScoreModalData({
        pointsEarned,
        previousScore: prevScore,
        newScore: newProfile.points,
      });
      setShowScoreModal(true);
    }
  };

  const recommendations = [
    'Take regular breaks every 2 hours',
    'Practice mindfulness meditation for 10 minutes daily',
    'Ensure 7-8 hours of sleep each night',
    'Engage in physical activity 3-4 times per week',
  ];

  useEffect(() => {
    // Check for auth data in URL (synced from landing page)
    const searchParams = new URLSearchParams(window.location.search);
    const authData = searchParams.get('auth');

    let currentUser = null;

    if (authData) {
      try {
        const userData = JSON.parse(decodeURIComponent(authData));
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        currentUser = userData;
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Failed to parse auth data', e);
        // Fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
           const parsed = JSON.parse(storedUser);
           setUser(parsed);
           currentUser = parsed;
        } else {
           router.push('/login');
        }
      }
    } else {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }
      currentUser = JSON.parse(storedUser);
      setUser(currentUser);
    }

    // Fetch real data from API
    if (currentUser && currentUser.id) {
      const fetchHistory = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
          const response = await fetch(`${API_URL}/api/predictions/user/${currentUser.id}`);
          if (response.ok) {
            const data = await response.json();
            
            if (data.length > 0) {
              // 1. Format for Chart
              // Sort by date ascending
              const sortedData = data.sort((a: any, b: any) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
              
              const history: BurnoutHistory[] = sortedData.map((item: any) => {
                const inputs = item.input_features || {};
                return {
                  date: new Date(item.created_at).toLocaleDateString(),
                  score: Math.round(item.burnout_score),
                  sleep_hours: inputs.sleep_hours_per_day || 0,
                  stress_level: inputs.stress_level || 0
                };
              });
              setChartData(history);

              // 2. Set Current Score
              const latest = sortedData[sortedData.length - 1];
              setBurnoutScore(Math.round(latest.burnout_score));
              setRiskLevel(latest.risk_level);

              // 3. Set Previous Score (for comparison)
              if (sortedData.length > 1) {
                const prev = sortedData[sortedData.length - 2];
                setPreviousScore(Math.round(prev.burnout_score));
              } else {
                setPreviousScore(Math.round(latest.burnout_score)); // No change if only 1
              }
            }
          }


          // Fetch Gamification Profile
          const profileRes = await fetch(`${API_URL}/api/gamification/profile/${currentUser.id}`);
          if (profileRes.ok) {
            setGamificationProfile(await profileRes.json());
          }

          // Fetch Goals
          const goalsRes = await fetch(`${API_URL}/api/gamification/goals/${currentUser.id}`);
          if (goalsRes.ok) {
            setGoals(await goalsRes.json());
          }

        } catch (error) {
          console.error("Failed to fetch history:", error);
        }
      };

      fetchHistory();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('latestAssessment');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--primary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#F5DE7A,#F2EEEC,#EFBF38,#E08600)] animate-gradient flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#F2EEEC]/30 to-[#F2EEEC]/10 backdrop-blur-2xl border-r border-white/30 shadow-2xl z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#763A12] font-serif">
              BurnAware
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={24} />
            </button>
          </div>

          {/* User Profile */}
          <div className="mb-8 p-4 bg-gradient-to-br from-[#AA4C0A]/10 to-[#E08600]/10 rounded-2xl border border-[#763A12]/5">
            <div className="w-12 h-12 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
              {user.name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <h3 className="font-semibold text-[#763A12]">{user.name || user.username || 'Student'}</h3>
            <p className="text-sm text-[#763A12]/70 truncate">{user.email || 'No email'}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white rounded-xl font-medium shadow-md shadow-[#E08600]/20">
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button
              onClick={() => router.push('/assessment')}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#763A12] hover:bg-[#F5DE7A]/20 rounded-xl font-medium transition-colors"
            >
              <FileText size={20} />
              New Assessment
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[var(--danger)] hover:bg-red-50 rounded-xl font-medium transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-[#F2EEEC]/10 backdrop-blur-xl shadow-sm sticky top-0 z-30 border-b border-white/30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-[#F2EEEC]/20 rounded-lg text-[#763A12]"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-[#763A12] font-serif">Dashboard</h2>
                <p className="text-sm text-[#763A12]/70">Welcome back, {user.name || 'Student'}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA4C0A]/10 to-[#E08600]/10 rounded-xl border border-[#763A12]/10">
                <Activity className="text-[#E08600]" size={20} />
                <span className="text-sm font-medium text-[#763A12]">Active</span>
              </div>
            </div>
          </div>
        </header>



        {/* Dashboard Content */}
        <main className="p-4 lg:p-8 space-y-8">
          {/* Daily Quote */}
          <DailyQuote />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-4">
              <GamificationCard profile={gamificationProfile} />
            </div>

            <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-[#763A12]/10 p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#AA4C0A]/10 to-[#E08600]/10 rounded-xl">
                  <Activity className="text-[#E08600]" size={24} />
                </div>
                <span className="text-sm font-medium text-[#763A12]/60">Current</span>
              </div>
              <h3 className="text-3xl font-bold text-[#763A12] mb-1">{burnoutScore}</h3>
              <p className="text-sm text-[#763A12]/80">Burnout Score</p>
            </div>

            <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-[#763A12]/10 p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#F5DE7A]/20 to-[#EFBF38]/20 rounded-xl">
                  <TrendingUp className="text-[#AA4C0A]" size={24} />
                </div>
                <span className="text-sm font-medium text-[#763A12]/60">Change</span>
              </div>
              <h3 className="text-3xl font-bold text-[#AA4C0A] mb-1">
                 {previousScore > 0 ? (previousScore - burnoutScore > 0 ? '-' : '+') : ''}{Math.abs(previousScore - burnoutScore)}
              </h3>
              <p className="text-sm text-[#763A12]/80">Points {previousScore - burnoutScore > 0 ? 'Improved' : 'Changed'}</p>
            </div>

            <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-[#763A12]/10 p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#E08600]/10 to-[#EFBF38]/10 rounded-xl">
                  <FileText className="text-[#E08600]" size={24} />
                </div>
                <span className="text-sm font-medium text-[#763A12]/60">Total</span>
              </div>
              <h3 className="text-3xl font-bold text-[#763A12] mb-1">{chartData.length}</h3>
              <p className="text-sm text-[#763A12]/80">Assessments</p>
            </div>

            <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-[#763A12]/10 p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  riskLevel === 'high' ? 'bg-red-100 text-red-600' :
                  riskLevel === 'medium' ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <Activity size={24} />
                </div>
                <span className="text-sm font-medium text-[#763A12]/60">Status</span>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${
                riskLevel === 'high' ? 'text-red-600' :
                riskLevel === 'medium' ? 'text-[#E08600]' :
                'text-green-600'
              }`}>
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </h3>
              <p className="text-sm text-[#763A12]/80">Risk Level</p>
            </div>
          </div>

          {/* Mood Tracker */}
          <div className="relative">
             <MoodTracker userId={user.id} onActivityComplete={() => handleActivityComplete(20)} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Metrics & Charts */}
            <div className="xl:col-span-2 space-y-6">
              <BurnoutScoreCard
                score={burnoutScore}
                riskLevel={riskLevel}
                recommendations={recommendations}
                previousScore={previousScore}
              />
              <BurnoutChart data={chartData} />
              <SleepStressChart data={chartData} />
            </div>

             {/* Right Column: Goals & History */}
            <div className="space-y-6">
               <GoalTracker goals={goals} userId={user.id} onGoalUpdate={() => handleActivityComplete(50)} />
               <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-[#763A12]/10 p-4 overflow-hidden">
                  <h3 className="text-lg font-bold text-[#763A12] mb-4 px-2">History</h3>
                  <div className="overflow-x-auto">
                    <HistoryTable data={chartData} />
                  </div>
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl border border-[#763A12]/10 p-8">
            <h3 className="text-xl font-bold text-[#763A12] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/assessment')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FileText size={20} />
                <span className="font-bold">Take New Assessment</span>
              </button>
              <button className="flex items-center gap-3 p-4 border-2 border-[#763A12] text-[#763A12] rounded-xl hover:bg-[#763A12] hover:text-white transition-all">
                <Activity size={20} />
                <span className="font-bold">View Detailed Report</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot */}
      <ChatbotPanel />

      {/* Score Upgrade Modal */}
      <ScoreUpgradeModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        pointsEarned={scoreModalData.pointsEarned}
        previousScore={scoreModalData.previousScore}
        newScore={scoreModalData.newScore}
        currentLevel={gamificationProfile?.level || 1}
        levelProgress={gamificationProfile?.points ? (gamificationProfile.points % 100) : 0}
        maxLevelXP={100}
      />
    </div>
  );
}
