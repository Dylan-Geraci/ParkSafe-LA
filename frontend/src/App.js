import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Valid Los Angeles ZIP codes (subset of most common ones)
const LA_ZIP_CODES = new Set([
  '90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010',
  '90011', '90012', '90013', '90014', '90015', '90016', '90017', '90018', '90019', '90020',
  '90021', '90022', '90023', '90024', '90025', '90026', '90027', '90028', '90029', '90030',
  '90031', '90032', '90033', '90034', '90035', '90036', '90037', '90038', '90039', '90040',
  '90041', '90042', '90043', '90044', '90045', '90046', '90047', '90048', '90049', '90050',
  '90051', '90052', '90053', '90054', '90055', '90056', '90057', '90058', '90059', '90060',
  '90061', '90062', '90063', '90064', '90065', '90066', '90067', '90068', '90069', '90070',
  '90071', '90072', '90073', '90074', '90075', '90076', '90077', '90078', '90079', '90080',
  '90081', '90082', '90083', '90084', '90085', '90086', '90087', '90088', '90089', '90090',
  '90091', '90092', '90093', '90094', '90095', '90096', '90097', '90098', '90099', '90100',
  '90210', '90211', '90212', '90213', '90220', '90221', '90222', '90230', '90232', '90240',
  '90241', '90242', '90245', '90247', '90248', '90249', '90250', '90251', '90254', '90255',
  '90260', '90261', '90262', '90263', '90264', '90265', '90266', '90267', '90270', '90272',
  '90274', '90275', '90277', '90278', '90280', '90290', '90291', '90292', '90293', '90294',
  '90295', '90296', '90301', '90302', '90303', '90304', '90305', '90306', '90307', '90308',
  '90309', '90310', '90311', '90312', '90401', '90402', '90403', '90404', '90405', '90406',
  '90407', '90408', '90409', '90410', '90411', '90501', '90502', '90503', '90504', '90505',
  '90601', '90602', '90603', '90604', '90605', '90606', '90607', '90608', '90609', '90610',
  '90620', '90621', '90622', '90623', '90624', '90630', '90631', '90632', '90633', '90637',
  '90638', '90639', '90640', '90650', '90651', '90652', '90660', '90661', '90662', '90670',
  '90671', '90680', '90701', '90702', '90703', '90704', '90706', '90707', '90710', '90711',
  '90712', '90713', '90714', '90715', '90716', '90717', '90720', '90721', '90723', '90731',
  '90732', '90733', '90734', '90740', '90742', '90743', '90744', '90745', '90746', '90747',
  '90748', '90749', '90755', '90801', '90802', '90803', '90804', '90805', '90806', '90807',
  '90808', '90809', '90810', '90813', '90814', '90815', '90822', '90831', '90832', '90833',
  '90834', '90835', '90840', '90842', '90844', '90846', '90847', '90848', '90853', '90888',
  '91001', '91006', '91007', '91008', '91009', '91010', '91011', '91012', '91016', '91017',
  '91020', '91021', '91023', '91024', '91025', '91030', '91031', '91040', '91041', '91042',
  '91043', '91101', '91102', '91103', '91104', '91105', '91106', '91107', '91108', '91109',
  '91110', '91114', '91115', '91116', '91117', '91118', '91121', '91123', '91124', '91125',
  '91126', '91182', '91184', '91185', '91188', '91189', '91199', '91201', '91202', '91203',
  '91204', '91205', '91206', '91207', '91208', '91209', '91210', '91214', '91221', '91222',
  '91224', '91225', '91226', '91301', '91302', '91303', '91304', '91305', '91306', '91307',
  '91308', '91309', '91310', '91311', '91313', '91316', '91320', '91321', '91322', '91324',
  '91325', '91326', '91327', '91328', '91329', '91330', '91331', '91333', '91334', '91335',
  '91340', '91341', '91342', '91343', '91344', '91345', '91346', '91350', '91351', '91352',
  '91353', '91354', '91355', '91356', '91357', '91360', '91361', '91362', '91364', '91365',
  '91367', '91371', '91372', '91376', '91377', '91380', '91381', '91382', '91383', '91384',
  '91385', '91386', '91387', '91390', '91392', '91393', '91394', '91395', '91396', '91401',
  '91402', '91403', '91405', '91406', '91407', '91408', '91409', '91410', '91411', '91412',
  '91413', '91416', '91423', '91426', '91436', '91470', '91482', '91495', '91496', '91497',
  '91499', '91501', '91502', '91503', '91504', '91505', '91506', '91507', '91508', '91510',
  '91521', '91522', '91523', '91526', '91601', '91602', '91603', '91604', '91605', '91606',
  '91607', '91608', '91609', '91610', '91611', '91612', '91614', '91615', '91616', '91617',
  '91618'
]);

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

  // Watch form data changes and update validation state
  useEffect(() => {
    const isValid = formData.zipcode && 
                   formData.zipcode.length === 5 && 
                   /^\d{5}$/.test(formData.zipcode) &&
                   LA_ZIP_CODES.has(formData.zipcode) &&
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
        } else if (!LA_ZIP_CODES.has(processedValue)) {
          setErrors(prev => ({ ...prev, zipcode: 'Please enter a valid Los Angeles ZIP code' }));
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
    } else if (!LA_ZIP_CODES.has(formData.zipcode)) {
      newErrors.zipcode = 'Please enter a valid Los Angeles ZIP code';
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
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.post(`${apiUrl}/predict`, formData, {
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
              Los Angeles ZIP Code
            </label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              placeholder="Enter LA ZIP code (e.g., 90210)"
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

        {/* Result */}
        {result && (
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
