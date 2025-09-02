import React, { useState } from 'react';
import axios from 'axios';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

function App() {
  const [formData, setFormData] = useState({
    zipcode: '',
    day_of_week: '',
    hour: '',
    am_pm: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.zipcode || formData.zipcode.length !== 5 || !/^\d{5}$/.test(formData.zipcode)) {
      newErrors.zipcode = 'Please enter a valid 5-digit ZIP code';
    }
    
    if (!formData.day_of_week) {
      newErrors.day_of_week = 'Please select a day of the week';
    }
    
    if (!formData.hour || formData.hour < 1 || formData.hour > 12) {
      newErrors.hour = 'Please enter a valid hour (1-12)';
    }
    
    if (!formData.am_pm) {
      newErrors.am_pm = 'Please select AM or PM';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Handle ZIP code input (numbers only, max 5 digits)
    if (name === 'zipcode') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 5);
    }
    
    // Handle hour input (numbers only, max 2 digits)
    if (name === 'hour') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 2);
      const hourNum = parseInt(processedValue);
      if (hourNum > 12) processedValue = '12';
      if (hourNum === 0) processedValue = '1';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Validate form after input change
    setTimeout(validateForm, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await axios.post('/predict', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Extract the result from the JSON response
      const { message, risk_level, probabilities } = response.data;
      setResult(message);
    } catch (error) {
      console.error('Error making prediction:', error);
      setResult('Error: Unable to make prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ParkSafe-LA
          </h1>
          <h2 className="text-xl text-gray-600">
            Risk Predictor
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ZIP Code */}
          <div>
            <label htmlFor="zipcode" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              placeholder="Enter 5-digit ZIP code"
              className={`input-field ${errors.zipcode ? 'border-red-500 bg-red-50' : ''}`}
              maxLength={5}
            />
            {errors.zipcode && (
              <p className="text-red-500 text-sm mt-1 animate-slide-up">{errors.zipcode}</p>
            )}
          </div>

          {/* Day of Week */}
          <div>
            <label htmlFor="day_of_week" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Day of the Week
            </label>
            <select
              id="day_of_week"
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleInputChange}
              className={`input-field ${errors.day_of_week ? 'border-red-500 bg-red-50' : ''}`}
            >
              <option value="">Select a day</option>
              {DAYS_OF_WEEK.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            {errors.day_of_week && (
              <p className="text-red-500 text-sm mt-1 animate-slide-up">{errors.day_of_week}</p>
            )}
          </div>

          {/* Hour and AM/PM */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hour" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Hour
              </label>
              <input
                type="text"
                id="hour"
                name="hour"
                value={formData.hour}
                onChange={handleInputChange}
                placeholder="1-12"
                className={`input-field ${errors.hour ? 'border-red-500 bg-red-50' : ''}`}
              />
              {errors.hour && (
                <p className="text-red-500 text-sm mt-1 animate-slide-up">{errors.hour}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="am_pm" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                AM/PM
              </label>
              <select
                id="am_pm"
                name="am_pm"
                value={formData.am_pm}
                onChange={handleInputChange}
                className={`input-field ${errors.am_pm ? 'border-red-500 bg-red-50' : ''}`}
              >
                <option value="">AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              {errors.am_pm && (
                <p className="text-red-500 text-sm mt-1 animate-slide-up">{errors.am_pm}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="btn-primary mt-8"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              'Predict Risk'
            )}
          </button>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-6 text-center">
            <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Analyzing risk factors...</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`risk-card ${result.includes('High') ? 'high' : 'low'}`}>
            {result}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800 leading-relaxed">
            <strong>Disclaimer:</strong> This tool is for informational purposes only and should not be used to plan, encourage, or engage in any illegal activities. The risk predictions are based on historical data analysis and should not be considered as legal advice or a guarantee of safety.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
