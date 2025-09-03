# 🚗 ParkSafe-LA: Parking Citation Risk Predictor

A machine learning system that predicts parking citation risk in Los Angeles using real-world data from 23+ million citation records. The project includes both the ML model and a production-ready web application.

## 📊 Project Overview

**Objective**: Develop a binary classification model to predict parking citation risk (low/high) based on location and time factors.

**Key Achievements**:
- **67% accuracy** on imbalanced real-world dataset
- **64% recall** for high-risk predictions
- **Production deployment** via Flask web application
- **23M+ records** processed and analyzed

**Technical Stack**: Python, scikit-learn, Pandas, NumPy, Flask, React.js, Tailwind CSS, Git

## 🏗️ Architecture & Implementation

### Data Pipeline
- **Data Source**: LA City parking citations (23M+ records) + US ZIP code geolocation data
- **Preprocessing**: Geospatial mapping using haversine BallTree, cyclical time encoding, feature engineering
- **Feature Engineering**: 
  - Cyclical encoding for hour (sin/cos transformation)
  - One-hot encoding for ZIP codes (228 unique LA County ZIPs)
  - Label encoding for day of week
  - Risk labeling based on citation volume thresholds

### Machine Learning Model
- **Algorithm**: Random Forest Classifier
- **Hyperparameters**: n_estimators=100, max_depth=15, class_weight='balanced'
- **Performance Metrics**:
  - Accuracy: 67%
  - Macro F1-Score: 0.66
  - High-Risk Recall: 64%
- **Model Persistence**: Saved as pickle file for production deployment

### Web Application
- **Backend**: Flask (Python) with RESTful API
- **Frontend**: React.js with Tailwind CSS
- **Features**:
  - Modern, responsive user interface
  - Real-time form validation
  - Professional design with glassmorphism effects
  - JSON API communication
  - Cross-platform compatibility

## 🚀 Getting Started

### Prerequisites
```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies (Node.js required)
cd frontend
npm install
```

### Running the Application

#### Option 1: Full Stack (Recommended)
1. **Start the Flask backend** (Terminal 1):
   ```bash
   python app.py
   ```
   Backend runs on: `http://localhost:5000`

2. **Start the React frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on: `http://localhost:3000`

#### Option 2: Backend Only (Legacy HTML)
```bash
python app.py
# Access at: http://localhost:5000
```

#### Option 3: Frontend Only (Development)
```bash
cd frontend
npm start
# Access at: http://localhost:3000
# Note: API calls will fail without backend running
```

### Making Predictions
- Enter ZIP code (e.g., 90001 for downtown LA)
- Select day of week
- Choose hour and AM/PM
- Get instant risk assessment with professional UI

## 📊 Data Sources

This project uses publicly available datasets:

- **LA Parking Citation Records**: [Los Angeles Open Data Portal](https://data.lacity.org/Transportation/Parking-Citations/4f5p-udkv/about_data)
  - 23+ million parking citation records from LA City
  - Includes location coordinates, timestamps, and citation details

- **US ZIP Code Geolocation Data**: [GeoNames](https://download.geonames.org/export/zip/)
  - `US.zip` - used to map ZIP codes to latitude/longitude for geospatial analysis
  

## 📁 Project Structure
```
ParkSafe-LA/
├── app.py                     # Flask backend API server with ML model integration
├── models/
│   └── parksafe_model_v1.pkl # Trained Random Forest model for production use
├── frontend/                  # React.js frontend application
│   ├── src/
│   │   ├── App.js            # Main React component with form and validation
│   │   ├── index.js          # React app entry point
│   │   └── index.css         # Tailwind CSS styles and custom components
│   ├── public/
│   ├── package.json          # Node.js dependencies and scripts
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── postcss.config.js     # PostCSS configuration for Tailwind
├── notebooks/                 # Jupyter notebooks for ML development
│   ├── pre_processing.ipynb  # Data preprocessing and feature engineering
│   └── modeling.ipynb        # Model training and evaluation
├── requirements.txt
└── README.md            
```

## 🧠 Technical Skills Demonstrated

### Machine Learning
- **Large-scale data processing** (23M+ records)
- **Feature engineering** for geospatial and temporal data
- **Handling class imbalance** in real-world datasets
- **Model evaluation** and performance optimization
- **Production model deployment**

### Software Engineering
- **Web application development** with Flask
- **API design** and request handling
- **Input validation** and error management
- **Code organization** and documentation
- **Version control** with Git

### Data Science
- **Geospatial analysis** and coordinate mapping
- **Time series feature engineering**
- **Statistical analysis** of citation patterns
- **Data visualization** and insights communication

## 📈 Business Impact

This project demonstrates the ability to:
- Efficient processing and analysis of large-scale datasets
- **End-to-end development** of production-ready machine learning models
- **Real-world problem-solving** through data-driven insights

## ⚠️ Disclaimer
ParkSafe-LA is intended purely as a safety-oriented, educational tool to help users understand trends in parking citation risk based on historical data. It must not be used to circumvent parking regulations or to justify illegal parking behavior. Always follow local parking signs and ordinances.

## 🔮 Future Additions

- **Cloud deployment** (AWS or Azure)
- **Interactive mapping** with risk visualization
- **Real-time data integration** for live predictions