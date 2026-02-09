import { useState, useEffect } from 'react';
import { GamificationProfile } from '@/lib/types';
import { Trophy, Flame, Star, Award } from 'lucide-react';

interface GamificationCardProps {
  profile: GamificationProfile | null;
}

export default function GamificationCard({ profile }: GamificationCardProps) {
  const [animatedPoints, setAnimatedPoints] = useState(0);

  useEffect(() => {
    if (profile?.points) {
      // Animate numbers
      const start = animatedPoints;
      const end = profile.points;
      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutExpo)
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setAnimatedPoints(Math.floor(start + (end - start) * ease));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [profile?.points]);

  // Show loading state if profile is null
  if (!profile) {
    return (
      <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-6 animate-fadeIn relative overflow-hidden border border-[#763A12]/10">
        <div className="text-center py-4">
          <p className="text-[#763A12]/70 animate-pulse">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const nextLevelPoints = profile.level * 100;
  const progress = (profile.points % 100) / 100 * 100;
  const pointsToNext = 100 - (profile.points % 100);

  return (
    <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-6 animate-fadeIn relative overflow-hidden border border-[#763A12]/10">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E08600] to-[#EFBF38] rounded-full -mr-10 -mt-10 opacity-10 blur-2xl animate-pulse" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="p-2 bg-[#F5DE7A]/20 rounded-lg text-[#E08600]">
               <Trophy size={20} />
             </div>
             <span className="font-bold text-[#763A12] text-lg">Level {profile.level}</span>
           </div>
           <h3 className="text-sm font-medium text-[#763A12]/70">Wellness Warrior</h3>
        </div>
        <div className="text-right">
           <div className="flex items-center gap-1 justify-end text-[#AA4C0A] font-bold text-2xl">
             <Flame size={28} className="animate-pulse drop-shadow-sm" fill="currentColor" />
             <span>{profile.streak?.current_streak || 0}</span>
           </div>
           <p className="text-xs font-semibold text-[#763A12]/50 uppercase tracking-widest">Day Streak</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 relative z-10">
        <div className="flex justify-between text-xs mb-2 font-semibold">
          <span className="text-gray-600">{animatedPoints} XP</span>
          <span className="text-gray-400">{nextLevelPoints} XP</span>
        </div>
        <div className="h-4 bg-[#763A12]/5 rounded-full overflow-hidden border border-[#763A12]/10 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#EFBF38] via-[#E08600] to-[#AA4C0A] transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
        
        {/* Dynamic Message */}
        <p className="text-center mt-3 text-sm font-medium text-orange-600 animate-slideUp">
          {pointsToNext <= 20 
             ? `🚀 So close! Just ${pointsToNext} XP to reach Level ${profile.level + 1}!` 
             : `✨ Great job! Keep going!`}
        </p>
      </div>

      {/* Recent Achievements Teaser */}
      {profile.achievements.length > 0 && (
        <div className="relative z-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Achievements</p>
          <div className="flex gap-2">
            {profile.achievements.slice(0, 3).map((ach) => (
              <div key={ach.id} className="p-2 bg-yellow-50 rounded-xl border border-yellow-100 tooltip" title={ach.name}>
                <Award className="text-yellow-600" size={16} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
