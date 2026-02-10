// Days of week for form selection
export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  SCORE_COUNT: 1500,
  CARD_TRANSITION: 400,
  PROGRESS_BAR: 800,
  MICRO_INTERACTION: 200,
};

// Risk level thresholds
export const RISK_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
};

// Form validation rules
export const VALIDATION_RULES = {
  ZIPCODE_LENGTH: 5,
  HOUR_MIN: 1,
  HOUR_MAX: 12,
};
