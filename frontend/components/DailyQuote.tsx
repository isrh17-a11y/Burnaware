"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const QUOTES = [
  { text: "Rest is not idleness, and to lie sometimes on the grass under trees on a summer's day, listening to the murmur of the water, or watching the clouds float across the sky, is by no means a waste of time.", author: "John Lubbock" },
  { text: "You can't pour from an empty cup. Take care of yourself first.", author: "Unknown" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  { text: "Burnout is nature's way of telling you, you've been going through the motions your soul uses.", author: "Sam Keen" },
  { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
  { text: "It’s okay to take a break. It’s okay to be still. It’s okay to do nothing.", author: "Unknown" },
  { text: "Recovery is an evolution, not a miracle.", author: "Unknown" },
];

export default function DailyQuote() {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Pick a random quote based on the day of the year to be consistent for the "Daily" aspect
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % QUOTES.length;
    setQuote(QUOTES[index]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#F5DE7A]/20 to-[#E08600]/10 border border-[#763A12]/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-[#763A12]/5"
    >
      <Quote className="absolute top-4 left-4 text-[#AA4C0A]/10 w-16 h-16 -z-10 transform -scale-x-100" />
      
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h3 className="text-xl md:text-2xl font-serif text-[#763A12] leading-relaxed italic mb-4">
          "{quote.text}"
        </h3>
        <span className="text-sm font-medium text-[#AA4C0A] uppercase tracking-wider opacity-80">
          — {quote.author}
        </span>
      </div>
    </motion.div>
  );
}
