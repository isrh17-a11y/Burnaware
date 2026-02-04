'use client';

import { useState } from 'react';
import { Goal } from '@/lib/types';
import { CheckCircle2, Circle, Target, Plus, Calendar } from 'lucide-react';
import { ApiClient } from '@/lib/api'; // Assuming you extend ApiClient later or use fetch here

import confetti from 'canvas-confetti';

interface GoalTrackerProps {
  goals: Goal[];
  userId: number;
  onGoalUpdate: () => void;
}

const PASTEL_COLORS = [
  'bg-[#F2EEEC] hover:bg-white border-[#AA4C0A]/10 text-[#763A12]',
  'bg-[#F5DE7A]/20 hover:bg-[#F5DE7A]/30 border-[#EFBF38]/20 text-[#763A12]',
  'bg-[#AA4C0A]/10 hover:bg-[#AA4C0A]/20 border-[#AA4C0A]/20 text-[#763A12]',
  'bg-[#E08600]/10 hover:bg-[#E08600]/20 border-[#E08600]/20 text-[#763A12]',
  'bg-[#EFBF38]/20 hover:bg-[#EFBF38]/30 border-[#EFBF38]/20 text-[#763A12]',
  'bg-[#763A12]/5 hover:bg-[#763A12]/10 border-[#763A12]/10 text-[#763A12]',
];

export default function GoalTracker({ goals, userId, onGoalUpdate }: GoalTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', category: 'personal' });

  const handleToggle = async (goal: Goal) => {
    if (goal.is_completed) return; 
    
    // Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    try {
      await fetch(`http://localhost:8000/api/gamification/goals/${goal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: true })
      });
      onGoalUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8000/api/gamification/goals/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      setIsAdding(false);
      setNewGoal({ title: '', category: 'personal' });
      onGoalUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const activeGoals = goals.filter(g => !g.is_completed);
  const completedGoals = goals.filter(g => g.is_completed);

  return (
    <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-6 animate-fadeIn border border-[#763A12]/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-[#F5DE7A]/20 rounded-xl text-[#E08600]">
             <Target size={24} />
           </div>
           <h2 className="text-xl font-bold text-[#763A12] font-serif">My Goals</h2>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-[#F5DE7A]/20 text-[#E08600] rounded-xl hover:bg-[#E08600] hover:text-white transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
         <form onSubmit={handleAdd} className="mb-6 p-4 bg-white/40 backdrop-blur-md rounded-xl border border-[#AA4C0A]/10 shadow-sm animate-slideDown">
           <input 
             type="text" 
             placeholder="What's your goal?" 
             className="w-full px-4 py-3 rounded-lg border border-gray-200 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500 bg-gray-50 font-medium"
             value={newGoal.title}
             onChange={e => setNewGoal({...newGoal, title: e.target.value})}
             required
           />
           <div className="flex gap-2">
             <select 
               className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none text-gray-700 bg-gray-50"
               value={newGoal.category}
               onChange={e => setNewGoal({...newGoal, category: e.target.value})}
             >
               <option value="personal">Personal</option>
               <option value="career">Career</option>
               <option value="wellness">Wellness</option>
             </select>
             <button type="submit" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-200">
               Save Goal
             </button>
           </div>
         </form>
      )}

      <div className="space-y-3">
        {activeGoals.length === 0 && !isAdding && (
          <p className="text-gray-400 text-sm text-center py-4">No active goals. Set one today!</p>
        )}
        
        {activeGoals.map((goal, index) => (
          <div 
            key={goal.id} 
            className={`flex items-start gap-3 p-4 rounded-2xl transition-all group cursor-pointer border hover:scale-[1.02] hover:shadow-md ${PASTEL_COLORS[index % PASTEL_COLORS.length]}`} 
            onClick={() => handleToggle(goal)}
          >
            <div className={`mt-0.5 ${goal.is_completed ? 'text-green-500' : 'text-gray-400 group-hover:text-orange-500'}`}>
              {goal.is_completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </div>
            <div>
              <p className="text-gray-800 font-medium text-lg">{goal.title}</p>
              <span className="text-xs px-2 py-0.5 bg-white/60 text-gray-700 rounded-full capitalize font-medium">{goal.category}</span>
            </div>
          </div>
        ))}

        {completedGoals.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Completed</p>
             {completedGoals.map(goal => (
                <div key={goal.id} className="flex items-center gap-3 p-2 opacity-60">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <p className="text-gray-500 text-sm line-through">{goal.title}</p>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
