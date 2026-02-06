import { DAYS_OF_WEEK, VALIDATION_RULES } from './constants';

/**
 * Encodes form data into URL search parameters
 * @param {Object} formData - Form data object with zipcode, day_of_week, hour, am_pm
 * @returns {string} URL search parameter string
 */
export const encodeSearchParams = (formData) => {
  const params = new URLSearchParams();

  // Map form field names to URL param names
  if (formData.zipcode) params.set('zip', formData.zipcode);
  if (formData.day_of_week) params.set('day', formData.day_of_week);
  if (formData.hour) params.set('hour', formData.hour);
  if (formData.am_pm) params.set('ampm', formData.am_pm);

  return params.toString();
};

/**
 * Decodes URL search parameters into form data
 * Validates parameters and returns null if invalid
 * @returns {Object|null} Form data object or null if invalid
 */
export const decodeSearchParams = () => {
  const params = new URLSearchParams(window.location.search);

  const zip = params.get('zip');
  const day = params.get('day');
  const hour = params.get('hour');
  const ampm = params.get('ampm');

  // Validate parameters
  if (!zip || !day || !hour || !ampm) {
    return null;
  }

  // Validate ZIP code format (5 digits)
  if (!/^\d{5}$/.test(zip)) {
    return null;
  }

  // Validate day is in allowed days
  if (!DAYS_OF_WEEK.includes(day)) {
    return null;
  }

  // Validate hour is between 1-12
  const hourNum = parseInt(hour, 10);
  if (isNaN(hourNum) || hourNum < VALIDATION_RULES.HOUR_MIN || hourNum > VALIDATION_RULES.HOUR_MAX) {
    return null;
  }

  // Validate AM/PM
  if (ampm !== 'AM' && ampm !== 'PM') {
    return null;
  }

  // Return with form field names
  return {
    zipcode: zip,
    day_of_week: day,
    hour: hour,
    am_pm: ampm,
  };
};

/**
 * Generates a shareable URL with current form data
 * @param {Object} formData - Form data to encode in URL
 * @returns {string} Complete shareable URL
 */
export const generateShareableURL = (formData) => {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = encodeSearchParams(formData);

  return params ? `${baseUrl}?${params}` : baseUrl;
};

/**
 * Updates the browser URL without reloading the page
 * @param {Object} formData - Form data to encode in URL
 */
export const updateBrowserURL = (formData) => {
  const newUrl = generateShareableURL(formData);
  window.history.replaceState({}, '', newUrl);
};

/**
 * Clears URL parameters without reloading
 */
export const clearURLParams = () => {
  const baseUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, '', baseUrl);
};
