"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitJournalEntry } from "@/app/actions";

export function JournalEntryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emotionTag: "",
    triggerCategory: "",
    content: ""
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

      const res = await submitJournalEntry({
        userId,
        userEmail: user.email,
        userName: user.username || user.name,
        emotionTag: formData.emotionTag,
        triggerCategory: formData.triggerCategory,
        content: formData.content,
      });

      if (res?.success) {
        alert("Journal entry saved!");
        router.push('/dashboard');
      } else {
        alert("Failed to save entry. Please check your database connection.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving journal entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#F2EEEC]/80 to-[#F5DE7A]/30 backdrop-blur-2xl rounded-3xl shadow-xl border border-[#763A12]/10 p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-[#763A12] mb-2 font-serif">Daily Journal</h2>
        <p className="text-[#763A12]/70 text-sm">Express yourself safely. Your thoughts are encrypted.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#763A12]">How are you feeling?</label>
          <select 
            value={formData.emotionTag} 
            onChange={(e) => setFormData({...formData, emotionTag: e.target.value})}
            className="w-full px-4 py-3 bg-white/60 border border-[#763A12]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AA4C0A]/50 text-gray-800"
            required
          >
            <option value="" disabled>Select an emotion...</option>
            <option value="anxious">Anxious</option>
            <option value="overwhelmed">Overwhelmed</option>
            <option value="exhausted">Exhausted</option>
            <option value="motivated">Motivated</option>
            <option value="calm">Calm</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="triggerCategory" className="block text-sm font-semibold text-[#763A12]">What is on your mind?</label>
          <input 
            id="triggerCategory" 
            placeholder="e.g. Work deadline, Exam stress, Personal"
            value={formData.triggerCategory}
            onChange={(e) => setFormData({...formData, triggerCategory: e.target.value})}
            className="w-full px-4 py-3 bg-white/60 border border-[#763A12]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AA4C0A]/50 text-gray-800"
            required 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-semibold text-[#763A12]">Pour your thoughts out</label>
          <textarea 
            id="content" 
            placeholder="Write your thoughts here... (This will be encrypted and kept private)"
            className="w-full px-4 py-3 bg-white/60 border border-[#763A12]/20 rounded-xl min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#AA4C0A]/50 text-gray-800"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {loading ? 'Saving securely...' : 'Save Private Entry'}
        </button>
      </form>
    </div>
  );
}
