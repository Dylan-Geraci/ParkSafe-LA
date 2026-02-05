import React from 'react';

/**
 * Reusable form select component
 * @param {Object} props - Component props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.label - Select label text
 * @param {string} props.value - Selected value
 * @param {function} props.onChange - Change handler
 * @param {Array} props.options - Array of option values
 * @param {string} props.placeholder - Placeholder option text
 * @param {string} props.error - Error message
 * @param {boolean} props.isValid - Whether selection is valid
 */
const FormSelect = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  isValid = false,
}) => {
  const selectClasses = `input-field ${error ? 'error' : isValid ? 'valid' : ''}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold tracking-wide uppercase text-slate-300 mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={selectClasses}
        aria-label={label}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Error message */}
      {error && (
        <p id={`${id}-error`} className="text-red-400 text-xs mt-2 flex items-center" role="alert">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
