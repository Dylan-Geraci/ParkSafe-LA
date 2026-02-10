import { RISK_THRESHOLDS } from './constants';

/**
 * Gets the risk level from a percentage
 * @param {number} percentage - Risk percentage (0-100)
 * @returns {string} Risk level ('Low', 'Medium', or 'High')
 */
export const getRiskLevel = (percentage) => {
  if (percentage >= RISK_THRESHOLDS.HIGH) return 'High';
  if (percentage >= RISK_THRESHOLDS.MEDIUM) return 'Medium';
  return 'Low';
};

/**
 * Gets the color classes for a risk percentage
 * @param {number} percentage - Risk percentage (0-100)
 * @returns {Object} Object with gradient, border, shadow, badge classes
 */
export const getRiskColorClasses = (percentage) => {
  if (percentage >= RISK_THRESHOLDS.HIGH) {
    return {
      gradient: 'bg-gradient-to-br from-red-600 to-red-700',
      border: 'border-red-500/30',
      shadow: 'shadow-glow-red',
      badge: 'bg-red-100 text-red-900 border border-red-300',
      progressBar: 'bg-gradient-to-r from-red-600 to-red-700 shadow-glow-red',
    };
  }

  if (percentage >= RISK_THRESHOLDS.MEDIUM) {
    return {
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      border: 'border-amber-400/30',
      shadow: 'shadow-glow-amber',
      badge: 'bg-amber-100 text-amber-900 border border-amber-300',
      progressBar: 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-glow-amber',
    };
  }

  return {
    gradient: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
    border: 'border-emerald-500/30',
    shadow: 'shadow-glow-emerald',
    badge: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    progressBar: 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-glow-emerald',
  };
};

/**
 * Gets the color value (not CSS class) for PDF generation
 * @param {number} percentage - Risk percentage (0-100)
 * @returns {string} Color identifier ('high', 'medium', or 'low')
 */
export const getRiskColor = (percentage) => {
  if (percentage >= RISK_THRESHOLDS.HIGH) return 'high';
  if (percentage >= RISK_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
};

/**
 * Formats hour to ensure it's a valid 2-digit string
 * @param {string} value - Raw hour input value
 * @returns {string} Formatted hour string
 */
export const formatHourInput = (value) => {
  const processed = value.replace(/[^0-9]/g, '').slice(0, 2);
  const hourNum = parseInt(processed);

  if (hourNum > 12) return '12';
  if (hourNum === 0) return '1';

  return processed;
};

/**
 * Formats zipcode to ensure it's a valid 5-digit string
 * @param {string} value - Raw zipcode input value
 * @returns {string} Formatted zipcode string
 */
export const formatZipcodeInput = (value) => {
  return value.replace(/[^0-9]/g, '').slice(0, 5);
};
