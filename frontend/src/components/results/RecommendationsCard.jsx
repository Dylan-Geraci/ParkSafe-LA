import React from 'react';
import { motion } from 'framer-motion';

/**
 * Recommendations Card Component
 * Displays safety recommendations grid
 */
const RecommendationsCard = ({ recommendations, shouldReduceMotion }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="mt-6 md:mt-8 glass-card p-8 hover:shadow-glow-blue transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
    >
      <h4 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        </svg>
        Recommendations
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-3 p-4 bg-amber-900/20 rounded-lg border border-amber-500/30 hover:bg-amber-900/30 hover:border-amber-500/50 transition-all duration-200 cursor-default"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.3,
              delay: shouldReduceMotion ? 0 : 0.5 + index * 0.1,
            }}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    scale: 1.02,
                    y: -2,
                    boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)',
                  }
            }
          >
            <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/30">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-slate-200 text-sm font-medium leading-relaxed">{rec}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendationsCard;
