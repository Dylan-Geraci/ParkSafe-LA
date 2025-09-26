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
      const { message, enhanced } = response.data;
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
    <div className="min-h-screen professional-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            ParkSafe-LA Dashboard
          </h1>
          <h2 className="text-lg text-slate-600">
            Parking Risk Analytics for LA County
          </h2>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Form Card - Top Left */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Risk Assessment
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ZIP Code */}
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-slate-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  placeholder="90210"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.zipcode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  maxLength={5}
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>
                )}
              </div>

              {/* Day of Week */}
              <div>
                <label htmlFor="day_of_week" className="block text-sm font-medium text-slate-700 mb-1">
                  Day
                </label>
                <select
                  id="day_of_week"
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.day_of_week ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="">Select day</option>
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                {errors.day_of_week && (
                  <p className="text-red-500 text-xs mt-1">{errors.day_of_week}</p>
                )}
              </div>

              {/* Hour and AM/PM */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="hour" className="block text-sm font-medium text-slate-700 mb-1">
                    Hour
                  </label>
                  <input
                    type="text"
                    id="hour"
                    name="hour"
                    value={formData.hour}
                    onChange={handleInputChange}
                    placeholder="11"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.hour ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.hour && (
                    <p className="text-red-500 text-xs mt-1">{errors.hour}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="am_pm" className="block text-sm font-medium text-slate-700 mb-1">
                    Period
                  </label>
                  <select
                    id="am_pm"
                    name="am_pm"
                    value={formData.am_pm}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.am_pm ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  >
                    <option value="">AM/PM</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                  {errors.am_pm && (
                    <p className="text-red-500 text-xs mt-1">{errors.am_pm}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  !isFormValid || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Analyze Risk'
                )}
              </button>
            </form>
          </div>

          {/* Risk Score Card - Top Center */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {enhancedResult ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Risk Score
                </h3>
                <div className={`relative w-40 h-40 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  enhancedResult.riskPercentage >= 70 ? 'bg-gradient-to-br from-red-500 to-red-600' :
                  enhancedResult.riskPercentage >= 40 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                  'bg-gradient-to-br from-green-500 to-green-600'
                }`}>
                  <div className="text-white text-center">
                    <div className="text-4xl font-bold">{enhancedResult.riskPercentage}%</div>
                    <div className="text-base opacity-90">{enhancedResult.riskLevel}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Confidence:</span> {enhancedResult.confidence}%
                </p>
                <p className="text-gray-500 text-xs">
                  {enhancedResult.location.time} on {enhancedResult.location.day} • ZIP {enhancedResult.location.zipcode}
                </p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Analyzing Risk...</p>
                <p className="text-gray-500 text-sm mt-1">Processing location and timing data</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Fill out the form to see your risk analysis</p>
              </div>
            )}
          </div>

          {/* Risk Factors Card - Top Right */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Risk Factors
            </h3>
            {enhancedResult ? (
              <div className="space-y-8">
                {/* Location Factor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="text-blue-600 mr-2">📍</span>
                      Location (ZIP {enhancedResult.location.zipcode})
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enhancedResult.analysis.factors.location.percentage >= 70 ? 'bg-red-100 text-red-800' :
                      enhancedResult.analysis.factors.location.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {enhancedResult.analysis.factors.location.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        enhancedResult.analysis.factors.location.percentage >= 70 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        enhancedResult.analysis.factors.location.percentage >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.location.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Time Factor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="text-purple-600 mr-2">🕐</span>
                      Time ({enhancedResult.location.time})
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enhancedResult.analysis.factors.timing.percentage >= 70 ? 'bg-red-100 text-red-800' :
                      enhancedResult.analysis.factors.timing.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {enhancedResult.analysis.factors.timing.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        enhancedResult.analysis.factors.timing.percentage >= 70 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        enhancedResult.analysis.factors.timing.percentage >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.timing.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Day Factor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="text-green-600 mr-2">📅</span>
                      Day ({enhancedResult.location.day})
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enhancedResult.analysis.factors.dayOfWeek.percentage >= 70 ? 'bg-red-100 text-red-800' :
                      enhancedResult.analysis.factors.dayOfWeek.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {enhancedResult.analysis.factors.dayOfWeek.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        enhancedResult.analysis.factors.dayOfWeek.percentage >= 70 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        enhancedResult.analysis.factors.dayOfWeek.percentage >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.dayOfWeek.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Risk breakdown will appear here after analysis</p>
              </div>
            )}
          </div>
        </div>


        {/* Recommendations Section - Bottom Row */}
        {enhancedResult && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
              Recommendations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhancedResult.analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors duration-200">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-amber-800 text-sm font-medium">{rec}</span>
                </div>
              ))}
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
