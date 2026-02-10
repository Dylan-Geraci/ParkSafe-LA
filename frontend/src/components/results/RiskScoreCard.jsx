import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedScore } from '../../hooks/useAnimatedScore';
import { getRiskColorClasses } from '../../utils/formatters';
import SkeletonCard from '../ui/SkeletonCard';

/**
 * Risk Score Card Component
 * Displays the circular risk score with animations
 */
const RiskScoreCard = ({ result, isLoading, shouldReduceMotion }) => {
  const animatedScore = useAnimatedScore(
    result?.riskPercentage,
    shouldReduceMotion
  );

  const scoreVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: shouldReduceMotion ? 'tween' : 'spring',
        stiffness: 100,
        damping: 15,
        duration: shouldReduceMotion ? 0.01 : 0.6,
      },
    },
  };

  // Get animation based on risk level
  const getRiskAnimation = (percentage) => {
    if (shouldReduceMotion) return {};

    if (percentage >= 70) {
      // High risk: subtle pulse with shake
      return {
        scale: [1, 1.02, 1],
        rotate: [0, -1, 1, -1, 0],
        transition: {
          duration: 0.5,
          delay: 0.6,
        },
      };
    } else if (percentage >= 40) {
      // Medium risk: gentle pulse
      return {
        scale: [1, 1.03, 1],
        transition: {
          duration: 0.4,
          delay: 0.6,
        },
      };
    } else {
      // Low risk: success pulse with glow
      return {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.5,
          delay: 0.6,
        },
      };
    }
  };

  // Loading state - use skeleton instead of spinner
  if (isLoading) {
    return <SkeletonCard variant="score" />;
  }

  // Empty state
  if (!result) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-300">
          <svg className="w-10 h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-slate-900 text-sm font-medium">Fill out the form to see your risk analysis</p>
      </div>
    );
  }

  // Result state
  const colorClasses = getRiskColorClasses(result.riskPercentage);

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center justify-center font-heading">
        <svg className="w-6 h-6 mr-2 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Risk Score
      </h3>

      <motion.div
        className={`relative w-44 h-44 mx-auto mb-6 rounded-full flex items-center justify-center border-4 ${colorClasses.gradient} ${colorClasses.border} ${colorClasses.shadow}`}
        variants={scoreVariants}
        initial="hidden"
        animate={["visible", getRiskAnimation(result.riskPercentage)]}
      >
        <div className="text-white text-center">
          <motion.div className="text-5xl font-extrabold mb-1" key={animatedScore}>
            {animatedScore}%
          </motion.div>
          <div className="text-lg font-semibold opacity-90">{result.riskLevel}</div>
        </div>
      </motion.div>

      <motion.p
        className="text-slate-700 text-sm mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.4 }}
      >
        <span className="font-semibold text-slate-900">Confidence:</span> {result.confidence}%
      </motion.p>

      <motion.p
        className="text-slate-600 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.5 }}
      >
        {result.location.time} on {result.location.day} • ZIP {result.location.zipcode}
      </motion.p>
    </div>
  );
};

export default RiskScoreCard;
