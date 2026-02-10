import React from 'react';
import { motion } from 'framer-motion';
import { ParkingMeterIcon, ParkingTimerIcon, ParkingCalendarIcon } from '../ui/ParkingIcons';
import { getRiskColorClasses } from '../../utils/formatters';
import SkeletonCard from '../ui/SkeletonCard';

/**
 * Risk Factors Card Component
 * Shows location/time/day risk factors with progress bars
 */
const RiskFactorsCard = ({ result, isLoading, shouldReduceMotion }) => {
  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (percentage) => ({
      width: `${percentage}%`,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.8,
        ease: 'easeOut',
        delay: shouldReduceMotion ? 0 : 0.3,
      },
    }),
  };

  // Loading state - use skeleton
  if (isLoading) {
    return <SkeletonCard variant="factors" />;
  }

  // Empty state
  if (!result) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-300">
          <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-slate-900 text-sm font-medium">Risk breakdown will appear here after analysis</p>
      </div>
    );
  }

  const factors = [
    {
      icon: ParkingMeterIcon,
      label: `Location (ZIP ${result.location.zipcode})`,
      percentage: result.analysis.factors.location.percentage,
      delay: 0,
    },
    {
      icon: ParkingTimerIcon,
      label: `Time (${result.location.time})`,
      percentage: result.analysis.factors.timing.percentage,
      delay: 0.15,
    },
    {
      icon: ParkingCalendarIcon,
      label: `Day (${result.location.day})`,
      percentage: result.analysis.factors.dayOfWeek.percentage,
      delay: 0.3,
    },
  ];

  return (
    <>
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center font-heading">
        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Risk Factors
      </h3>

      <div className="space-y-8">
        {factors.map((factor, index) => {
          const colorClasses = getRiskColorClasses(factor.percentage);
          const Icon = factor.icon;

          return (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-800 flex items-center">
                  <Icon className="w-5 h-5 mr-2 text-slate-700" />
                  {factor.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClasses.badge}`}>
                  {factor.percentage}%
                </span>
              </div>
              <div className="w-full bg-blue-100/50 rounded-full h-3 overflow-hidden border border-blue-200">
                <motion.div
                  className={`h-3 rounded-full ${colorClasses.progressBar}`}
                  variants={progressBarVariants}
                  initial="hidden"
                  animate="visible"
                  custom={factor.percentage}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.3 + factor.delay }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RiskFactorsCard;
