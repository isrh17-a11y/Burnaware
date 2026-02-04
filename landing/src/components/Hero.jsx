import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#F5DE7A,#F2EEEC,#EFBF38,#E08600)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#E08600]/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#AA4C0A]/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5DE7A]/60 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Logo/Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-[#F2EEEC]/90 backdrop-blur-sm px-6 py-2.5 rounded-full shadow-md mb-8 ring-1 ring-[#763A12]/10"
          >
            <span className="text-2xl animate-pulse">🔥</span>
            <span className="text-sm font-bold text-[#763A12] tracking-wide">BurnAware</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 drop-shadow-sm font-serif tracking-tight"
          >
            <span className="bg-gradient-to-r from-[#AA4C0A] via-[#E08600] to-[#AA4C0A] bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(255,255,255,0.8)] filter">
              BurnAware
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl text-[#763A12] mb-8 font-medium leading-tight drop-shadow-[0_1px_15px_rgba(255,255,255,0.6)] font-serif italic"
          >
            Prevent burnout before it <span className="text-[#AA4C0A] font-bold bg-[#F5DE7A]/50 px-2 py-0.5 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.6)] not-italic">breaks you</span>
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-xl text-[#763A12]/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-[0_1px_10px_rgba(255,255,255,0.5)]"
          >
            Track your stress levels, monitor your mood, and get personalized recovery tips
            to maintain a healthy work-life balance.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Privacy first</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Scientifically backed</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

