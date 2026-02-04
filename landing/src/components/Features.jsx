import { motion } from 'framer-motion';
import { Brain, Heart, Bell, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Stress Tracking',
    description: 'Monitor your daily stress levels with intuitive check-ins and visualize patterns over time.',
    gradient: 'from-[#AA4C0A] to-[#E08600]'
  },
  {
    icon: Heart,
    title: 'Mood Logs',
    description: 'Keep a personal mood journal to understand emotional triggers and track improvements.',
    gradient: 'from-[#763A12] to-[#AA4C0A]'
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Receive timely notifications when your stress levels indicate a burnout risk.',
    gradient: 'from-[#E08600] to-[#EFBF38]'
  },
  {
    icon: Lightbulb,
    title: 'Recovery Tips',
    description: 'Get personalized recommendations based on your unique stress and mood patterns.',
    gradient: 'from-[#EFBF38] to-[#F5DE7A]'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

const Features = () => {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[linear-gradient(to_bottom_right,#F5DE7A,#F2EEEC,#EFBF38,#E08600)]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#763A12] mb-4 drop-shadow-[0_2px_15px_rgba(255,255,255,0.6)] font-serif">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-[#AA4C0A] to-[#E08600] bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(255,255,255,0.8)]">
              Stay Balanced
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#763A12]/80 font-medium max-w-2xl mx-auto drop-shadow-[0_1px_10px_rgba(255,255,255,0.5)]">
            Powerful features designed to help you understand, prevent, and recover from burnout.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 40px rgba(118, 58, 18, 0.15)'
                }}
                className="group relative bg-[#F2EEEC]/90 rounded-2xl p-6 sm:p-8 shadow-lg shadow-[#763A12]/5 transition-all duration-300 border border-[#763A12]/10"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg`}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#763A12] mb-3 group-hover:text-[#AA4C0A] transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#763A12]/70 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 -z-10`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F5DE7A]/30 to-[#EFBF38]/30 border border-[#E08600]/10 px-6 py-3 rounded-full">
            <span className="text-2xl">🎯</span>
            <span className="text-[#763A12] font-medium">
              Join 10,000+ people preventing burnout
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

