import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable glass card component with optional animation
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover animation
 * @param {Object} props.variants - Framer Motion variants
 * @param {boolean} props.shouldReduceMotion - Reduce motion preference
 * @param {string} props.colSpan - Grid column span class (e.g., 'lg:col-span-4')
 */
const Card = ({
  children,
  className = '',
  hover = true,
  variants,
  shouldReduceMotion = false,
  colSpan = '',
  ...motionProps
}) => {
  const baseClasses = 'glass-card p-8 hover:shadow-glow-blue transition-all duration-300';
  const combinedClasses = `${colSpan} ${baseClasses} ${className}`.trim();

  const hoverAnimation = hover && !shouldReduceMotion
    ? { y: -2, transition: { duration: 0.2 } }
    : {};

  return (
    <motion.div
      className={combinedClasses}
      variants={variants}
      whileHover={hoverAnimation}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default Card;
