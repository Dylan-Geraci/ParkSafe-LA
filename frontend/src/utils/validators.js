import { VALIDATION_RULES } from './constants';

/**
 * Validates a ZIP code
 * @param {string} zipcode - The ZIP code to validate
 * @returns {string|undefined} Error message or undefined if valid
 */
export const validateZipcode = (zipcode) => {
  if (!zipcode || zipcode.length !== VALIDATION_RULES.ZIPCODE_LENGTH) {
    return 'Please enter a valid 5-digit ZIP code';
  }
  if (!/^\d{5}$/.test(zipcode)) {
    return 'Please enter a valid 5-digit ZIP code';
  }
  return undefined;
};

/**
 * Validates day of week selection
 * @param {string} day - The selected day
 * @returns {string|undefined} Error message or undefined if valid
 */
export const validateDayOfWeek = (day) => {
  if (!day) {
    return 'Please select a day of the week';
  }
  return undefined;
};

/**
 * Validates hour input
 * @param {string|number} hour - The hour to validate
 * @returns {string|undefined} Error message or undefined if valid
 */
export const validateHour = (hour) => {
  const hourNum = parseInt(hour);
  if (!hour || isNaN(hourNum) || hourNum < VALIDATION_RULES.HOUR_MIN || hourNum > VALIDATION_RULES.HOUR_MAX) {
    return 'Please enter a valid hour (1-12)';
  }
  return undefined;
};

/**
 * Validates AM/PM selection
 * @param {string} amPm - The AM/PM value
 * @returns {string|undefined} Error message or undefined if valid
 */
export const validateAmPm = (amPm) => {
  if (!amPm) {
    return 'Please select AM or PM';
  }
  return undefined;
};

/**
 * Validates entire form data
 * @param {Object} formData - Form data object with zipcode, day_of_week, hour, am_pm
 * @returns {Object} Errors object with field names as keys
 */
export const validateForm = (formData) => {
  const errors = {};

  const zipcodeError = validateZipcode(formData.zipcode);
  if (zipcodeError) errors.zipcode = zipcodeError;

  const dayError = validateDayOfWeek(formData.day_of_week);
  if (dayError) errors.day_of_week = dayError;

  const hourError = validateHour(formData.hour);
  if (hourError) errors.hour = hourError;

  const amPmError = validateAmPm(formData.am_pm);
  if (amPmError) errors.am_pm = amPmError;

  return errors;
};

/**
 * Checks if form is valid (all fields filled and valid)
 * @param {Object} formData - Form data object
 * @returns {boolean} True if form is valid
 */
export const isFormValid = (formData) => {
  return (
    formData.zipcode &&
    formData.zipcode.length === VALIDATION_RULES.ZIPCODE_LENGTH &&
    /^\d{5}$/.test(formData.zipcode) &&
    formData.day_of_week &&
    formData.hour &&
    formData.hour >= VALIDATION_RULES.HOUR_MIN &&
    formData.hour <= VALIDATION_RULES.HOUR_MAX &&
    formData.am_pm
  );
};
