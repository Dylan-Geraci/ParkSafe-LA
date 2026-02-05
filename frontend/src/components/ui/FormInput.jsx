import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable form input component with validation UI
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label text
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.type - Input type (default: 'text')
 * @param {number} props.maxLength - Max input length
 * @param {string} props.error - Error message
 * @param {boolean} props.isValid - Whether input is valid
 */
const FormInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  error,
  isValid = false,
}) => {
  const inputClasses = `input-field ${error ? 'error' : isValid ? 'valid' : ''}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold tracking-wide uppercase text-slate-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          maxLength={maxLength}
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {/* Valid checkmark icon */}
        {isValid && !error && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}

        {/* Error icon */}
        {error && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          id={`${id}-error`}
          className="text-red-400 text-xs mt-2 flex items-center"
          role="alert"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FormInput;
