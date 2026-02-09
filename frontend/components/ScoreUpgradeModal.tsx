'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoreUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pointsEarned: number;
  previousScore: number;
  newScore: number;
  currentLevel: number;
  levelProgress: number; // 0-100
  maxLevelXP: number;
}

export default function ScoreUpgradeModal({
  isOpen,
  onClose,
  pointsEarned,
  previousScore,
  newScore,
  currentLevel,
  levelProgress,
  maxLevelXP,
}: ScoreUpgradeModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti when modal opens
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E08600', '#F5DE7A', '#EFBF38', '#AA4C0A']
      });

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-gradient-to-br from-[#F2EEEC] to-[#F5DE7A]/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#763A12]/20 p-8 max-w-md w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#763A12]/10 transition-colors text-[#763A12]"
            >
              <X size={20} />
            </button>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#E08600]/20 to-[#EFBF38]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-[#AA4C0A]/20 to-[#F5DE7A]/20 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#AA4C0A] to-[#E08600] rounded-full flex items-center justify-center shadow-lg"
              >
                <Star className="text-white" size={40} fill="white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-[#763A12] mb-2"
              >
                🎉 Congratulations! 🎉
              </motion.h2>

              {/* Points Earned */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] rounded-full text-white shadow-lg">
                  <Zap size={24} fill="white" />
                  <span className="text-2xl font-bold">+{pointsEarned} XP</span>
                </div>
              </motion.div>

              {/* Score Comparison */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <p className="text-sm text-[#763A12]/70 mb-2">Your New Score</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl font-bold text-[#763A12]/60">{previousScore}</span>
                  <TrendingUp className="text-[#E08600]" size={24} />
                  <span className="text-4xl font-bold text-[#E08600]">{newScore}</span>
                </div>
              </motion.div>

              {/* Level Progress */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/40 rounded-2xl p-4 backdrop-blur-sm border border-[#763A12]/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#763A12]">Level {currentLevel}</span>
                  <span className="text-xs text-[#763A12]/70">{newScore}/{maxLevelXP} XP</span>
                </div>
                <div className="w-full h-3 bg-[#F2EEEC]/60 rounded-full overflow-hidden border border-[#763A12]/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#AA4C0A] to-[#E08600] shadow-sm"
                  />
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white rounded-full font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Continue ✓
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
