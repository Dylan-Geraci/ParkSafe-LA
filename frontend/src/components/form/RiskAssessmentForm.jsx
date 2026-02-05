import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import { DAYS_OF_WEEK, VALIDATION_RULES } from '../../utils/constants';
import { validateZipcode } from '../../utils/validators';
import { formatZipcodeInput, formatHourInput } from '../../utils/formatters';

/**
 * Risk Assessment Form Component
 * Handles user input for parking risk prediction
 */
const RiskAssessmentForm = forwardRef(({ onSubmit, isLoading }, ref) => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    zipcode: '',
    day_of_week: '',
    hour: '',
    am_pm: '',
  });
  const [errors, setErrors] = useState({});

  // Check if form is valid
  const isFormValid =
    formData.zipcode &&
    formData.zipcode.length === VALIDATION_RULES.ZIPCODE_LENGTH &&
    /^\d{5}$/.test(formData.zipcode) &&
    formData.day_of_week &&
    formData.hour &&
    formData.hour >= VALIDATION_RULES.HOUR_MIN &&
    formData.hour <= VALIDATION_RULES.HOUR_MAX &&
    formData.am_pm;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Handle ZIP code input
    if (name === 'zipcode') {
      processedValue = formatZipcodeInput(value);
    }

    // Handle hour input
    if (name === 'hour') {
      processedValue = formatHourInput(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Validate ZIP code as user types
    if (name === 'zipcode') {
      if (processedValue.length === VALIDATION_RULES.ZIPCODE_LENGTH) {
        const error = validateZipcode(processedValue);
        setErrors((prev) => ({ ...prev, zipcode: error }));
      } else if (processedValue.length > 0) {
        setErrors((prev) => ({ ...prev, zipcode: undefined }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    updateTime: (timeData) => {
      setFormData((prev) => ({
        ...prev,
        hour: String(timeData.hour),
        am_pm: timeData.am_pm,
      }));
    },
    loadFormData: (data) => {
      setFormData({
        zipcode: data.zipcode,
        day_of_week: data.day_of_week,
        hour: String(data.hour),
        am_pm: data.am_pm,
      });
    },
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ZIP Code */}
      <FormInput
        id="zipcode"
        name="zipcode"
        label="ZIP Code"
        value={formData.zipcode}
        onChange={handleInputChange}
        placeholder="90210"
        maxLength={5}
        error={errors.zipcode}
        isValid={formData.zipcode.length === 5 && !errors.zipcode}
      />

      {/* Day of Week */}
      <FormSelect
        id="day_of_week"
        name="day_of_week"
        label="Day"
        value={formData.day_of_week}
        onChange={handleInputChange}
        options={DAYS_OF_WEEK}
        placeholder="Select day"
        error={errors.day_of_week}
        isValid={!!formData.day_of_week}
      />

      {/* Hour and AM/PM */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          id="hour"
          name="hour"
          label="Hour"
          value={formData.hour}
          onChange={handleInputChange}
          placeholder="11"
          error={errors.hour}
          isValid={formData.hour >= 1 && formData.hour <= 12}
        />

        <FormSelect
          id="am_pm"
          name="am_pm"
          label="Period"
          value={formData.am_pm}
          onChange={handleInputChange}
          options={['AM', 'PM']}
          placeholder="AM/PM"
          error={errors.am_pm}
          isValid={!!formData.am_pm}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={`btn-primary mt-6 flex items-center justify-center space-x-2 ${
          !isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label={isLoading ? 'Analyzing risk' : 'Analyze risk'}
        whileHover={!isFormValid || isLoading || shouldReduceMotion ? {} : { scale: 1.02 }}
        whileTap={!isFormValid || isLoading || shouldReduceMotion ? {} : { scale: 0.98 }}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Analyze Risk</span>
          </>
        )}
      </motion.button>
    </form>
  );
});

export default RiskAssessmentForm;
