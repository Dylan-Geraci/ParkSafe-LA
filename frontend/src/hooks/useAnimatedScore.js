import { useState, useEffect, useRef } from 'react';
import { ANIMATION_DURATIONS } from '../utils/constants';

/**
 * Custom hook for animating score counting
 * @param {number} targetScore - Target score to count to (0-100)
 * @param {boolean} shouldReduceMotion - Whether to reduce motion
 * @returns {number} Current animated score value
 */
export const useAnimatedScore = (targetScore, shouldReduceMotion = false) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!targetScore) {
      setAnimatedScore(0);
      return;
    }

    // If reduced motion is enabled, skip animation
    if (shouldReduceMotion) {
      setAnimatedScore(targetScore);
      return;
    }

    // Animate score counting
    setAnimatedScore(0);
    const duration = ANIMATION_DURATIONS.SCORE_COUNT;
    const steps = 60;
    const increment = targetScore / steps;
    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedScore(targetScore);
        clearInterval(intervalRef.current);
      } else {
        setAnimatedScore(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetScore, shouldReduceMotion]);

  return animatedScore;
};
