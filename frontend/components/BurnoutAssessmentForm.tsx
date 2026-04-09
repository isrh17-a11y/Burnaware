"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitBurnoutAssessment } from "@/app/actions";

export function BurnoutAssessmentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    exhaustionScore: "",
    cynicismScore: "",
    professionalEfficacy: "",
    phq4Score: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in first!");
        router.push('/login');
        return;
      }
      const user = JSON.parse(storedUser);
      const userId = user.id || user.user_id;

      const res = await submitBurnoutAssessment({
        userId,
        userEmail: user.email,
        userName: user.username || user.name,
        exhaustionScore: parseFloat(formData.exhaustionScore),
        cynicismScore: parseFloat(formData.cynicismScore),
        professionalEfficacy: parseFloat(formData.professionalEfficacy),
        phq4Score: parseFloat(formData.phq4Score),
      });

      if (res?.success) {
        alert("Assessment submitted successfully!");
        router.push('/dashboard');
      } else {
        alert("Failed to submit assessment. Please check if your database is connected properly.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting assessment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#F2EEEC]/80 to-[#F5DE7A]/30 backdrop-blur-2xl rounded-3xl shadow-xl border border-[#763A12]/10 p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-[#763A12] mb-2 font-serif">Burnout Check-In</h2>
        <p className="text-[#763A12]/70 text-sm">Let us understand how you're feeling lately so we can best support you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="exhaustionScore" className="block text-sm font-semibold text-[#763A12]">
            How drained or exhausted do you feel? (0 = Not at all, 30 = Completely exhausted)
          </label>
          <input 
            id="exhaustionScore" 
            type="number" 
            min="0" max="30"
            value={formData.exhaustionScore}
            onChange={(e) => setFormData({...formData, exhaustionScore: e.target.value})}
            className="w-full px-4 py-3 bg-white/60 border border-[#763A12]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AA4C0A]/50 text-gray-800"
            required 
            placeholder="e.g. 15"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cynicismScore" className="block text-sm font-semibold text-[#763A12]">
            How detached or cynical do you feel about work/study? (0 = Highly engaged, 30 = Very cynical)
          </label>
          <input 
            id="cynicismScore" 
            type="number" 
            min="0" max="30"
            value={formData.cynicismScore}
            onChange={(e) => setFormData({...formData, cynicismScore: e.target.value})}
            className="w-full px-4 py-3 bg-white/60 border border-[#763A12]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AA4C0A]/50 text-gray-800"
            required 
            placeholder="e.g. 10"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="professionalEfficacy" className="block text-sm font-semibold text-[#763A12]">
            How effective and accomplished do you feel? (0 = Ineffective, 30 = Highly effective)
          </label>
          <input 
            id="professionalEfficacy" 
            type="number" 
            min="0" max="30"
            value={formData.professionalEfficacy}
            onChange={(e) => setFormData({...formData, professionalEfficacy: e.target.value})}
            className="w-full px-4 py-3 bg-white/60 border border-[#763A12]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AA4C0A]/50 text-gray-800"
            required 
            placeholder="e.g. 25"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phq4Score" className="block text-sm font-semibold text-[#763A12]">
            Over the last 2 weeks, how often have you been bothered by anxiety or low mood? (0 = Not at all, 12 = Nearly every day)
          </label>
          <input 
            id="phq4Score" 
            type="number" 
            min="0" max="12"
            value={formData.phq4Score}
            onChange={(e) => setFormData({...formData, phq4Score: e.target.value})}
            className="w-full px-4 py-3 bg-white/60 border border-[#763A12]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AA4C0A]/50 text-gray-800"
            required 
            placeholder="e.g. 3"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Complete Check-In'}
        </button>
      </form>
    </div>
  );
}
