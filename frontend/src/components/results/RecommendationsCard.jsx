import React from 'react';
import { motion } from 'framer-motion';
import { ParkingSignIcon } from '../ui/ParkingIcons';

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
      className="mt-6 md:mt-8 glass-card p-8 hover:shadow-glow-indigo transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
    >
      <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center font-heading">
        <ParkingSignIcon className="w-6 h-6 mr-2 text-primary-600" />
        Recommendations
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 cursor-default"
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
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.15)',
                  }
            }
          >
            <div className="w-7 h-7 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-500/40">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-slate-800 text-sm font-medium leading-relaxed">{rec}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendationsCard;
