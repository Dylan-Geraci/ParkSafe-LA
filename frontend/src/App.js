import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// API base URL - defaults to proxy for local dev, can be overridden via environment
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

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
  const [enhancedResult, setEnhancedResult] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Watch form data changes and update validation state
  useEffect(() => {
    const isValid = formData.zipcode && 
                   formData.zipcode.length === 5 && 
                   /^\d{5}$/.test(formData.zipcode) &&
                   formData.day_of_week &&
                   formData.hour &&
                   formData.hour >= 1 &&
                   formData.hour <= 12 &&
                   formData.am_pm;
    setIsFormValid(isValid);
  }, [formData]);

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
    
    // Only validate ZIP code as user types (when it's complete)
    if (name === 'zipcode') {
      if (processedValue.length === 5) {
        if (!/^\d{5}$/.test(processedValue)) {
          setErrors(prev => ({ ...prev, zipcode: 'Please enter a valid 5-digit ZIP code' }));
        } else {
          setErrors(prev => ({ ...prev, zipcode: undefined }));
        }
      } else if (processedValue.length > 0) {
        // Clear error while typing
        setErrors(prev => ({ ...prev, zipcode: undefined }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields on submit
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
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setEnhancedResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Extract both basic and enhanced results
      const { message, risk_level, probabilities, enhanced } = response.data;
      setResult(message);

      // Store enhanced data if available
      if (enhanced) {
        setEnhancedResult(enhanced);
      }
    } catch (error) {
      console.error('Error making prediction:', error);
      setResult('Error: Unable to make prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen professional-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl card-shadow p-8 max-w-lg w-full relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            ParkSafe-LA
          </h1>
          <h2 className="text-lg text-slate-600 mb-4">
            Intelligent Parking Risk Assessment
          </h2>
          <div className="section-divider"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ZIP Code */}
          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-slate-700 mb-2">
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
            <label htmlFor="day_of_week" className="block text-sm font-medium text-slate-700 mb-2">
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
              <p className="text-red-500 text-sm mt-1 animate-slide-up">{errors.zipcode}</p>
            )}
          </div>

          {/* Hour and AM/PM */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hour" className="block text-sm font-medium text-slate-700 mb-2">
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
              <label htmlFor="am_pm" className="block text-sm font-medium text-slate-700 mb-2">
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

        {/* Enhanced Result Display */}
        {enhancedResult && (
          <div className="mt-8 space-y-6">
            {/* Risk Score Header */}
            <div className={`text-center p-6 rounded-xl ${
              enhancedResult.riskPercentage >= 70 ? 'bg-red-50 border border-red-200' :
              enhancedResult.riskPercentage >= 40 ? 'bg-yellow-50 border border-yellow-200' :
              'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center justify-center mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  enhancedResult.riskPercentage >= 70 ? 'bg-red-100' :
                  enhancedResult.riskPercentage >= 40 ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  {enhancedResult.riskPercentage >= 70 ? '⚠️' :
                   enhancedResult.riskPercentage >= 40 ? '⚡' : '✅'}
                </div>
              </div>
              <h3 className={`text-2xl font-bold ${
                enhancedResult.riskPercentage >= 70 ? 'text-red-800' :
                enhancedResult.riskPercentage >= 40 ? 'text-yellow-800' :
                'text-green-800'
              }`}>
                {enhancedResult.riskPercentage}% Risk Score
              </h3>
              <p className="text-gray-600 mt-1">
                Confidence: {enhancedResult.confidence}% • {enhancedResult.location.time} on {enhancedResult.location.day}
              </p>
            </div>

            {/* Risk Factors Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Risk Factor Analysis
              </h4>

              <div className="space-y-4">
                {/* Location Factor */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">📍 Location (ZIP {enhancedResult.location.zipcode})</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      enhancedResult.analysis.factors.location.percentage >= 70 ? 'bg-red-100 text-red-800' :
                      enhancedResult.analysis.factors.location.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {enhancedResult.analysis.factors.location.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${
                        enhancedResult.analysis.factors.location.percentage >= 70 ? 'bg-red-500' :
                        enhancedResult.analysis.factors.location.percentage >= 40 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.location.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{enhancedResult.analysis.factors.location.description}</p>
                </div>

                {/* Timing Factor */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">🕐 Time ({enhancedResult.location.time})</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      enhancedResult.analysis.factors.timing.percentage >= 70 ? 'bg-red-100 text-red-800' :
                      enhancedResult.analysis.factors.timing.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {enhancedResult.analysis.factors.timing.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${
                        enhancedResult.analysis.factors.timing.percentage >= 70 ? 'bg-red-500' :
                        enhancedResult.analysis.factors.timing.percentage >= 40 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.timing.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{enhancedResult.analysis.factors.timing.description}</p>
                </div>

                {/* Day Factor */}
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">📅 Day ({enhancedResult.location.day})</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      enhancedResult.analysis.factors.dayOfWeek.percentage >= 70 ? 'bg-red-100 text-red-800' :
                      enhancedResult.analysis.factors.dayOfWeek.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {enhancedResult.analysis.factors.dayOfWeek.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${
                        enhancedResult.analysis.factors.dayOfWeek.percentage >= 70 ? 'bg-red-500' :
                        enhancedResult.analysis.factors.dayOfWeek.percentage >= 40 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.dayOfWeek.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{enhancedResult.analysis.factors.dayOfWeek.description}</p>
                </div>
              </div>
            </div>

            {/* Insights */}
            {enhancedResult.analysis.insights.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Insights
                </h4>
                <div className="space-y-2">
                  {enhancedResult.analysis.insights.map((insight, index) => (
                    <div key={index} className="flex items-center text-blue-700">
                      <span className="mr-2">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
                Recommendations
              </h4>
              <div className="grid gap-3">
                {enhancedResult.analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-4 h-4 mr-3 mt-0.5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-amber-700 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Basic Result (fallback) */}
        {result && !enhancedResult && (
          <div className={`risk-card ${result.includes('High') ? 'high' : 'low'}`}>
            {result}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong> This tool is for informational purposes only and should not be used to plan, encourage, or engage in any illegal activities. The risk predictions are based on historical data analysis and should not be considered as legal advice or a guarantee of safety.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
