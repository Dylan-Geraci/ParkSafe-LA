import { useState, useEffect } from 'react';
import { validateForm, isFormValid as checkFormValid } from '../utils/validators';

/**
 * Custom hook for form validation
 * @param {Object} formData - Form data to validate
 * @returns {Object} { errors, isValid, setErrors, validateAllFields }
 */
export const useFormValidation = (formData) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Watch form data changes and update validation state
  useEffect(() => {
    const valid = checkFormValid(formData);
    setIsValid(valid);
  }, [formData]);

  /**
   * Validates all form fields
   * @returns {Object} Errors object
   */
  const validateAllFields = () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return newErrors;
  };

  return {
    errors,
    isValid,
    setErrors,
    validateAllFields,
  };
};
