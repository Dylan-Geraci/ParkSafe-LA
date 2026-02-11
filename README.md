# ParkSafe-LA: Parking Citation Risk Predictor

A full-stack machine learning application that predicts parking citation risk in Los Angeles using 23+ million real-world citation records. Features a production-ready Flask API and modern React UI with PDF export, shareable URLs, and offline detection.

🔗 **[Live Demo](https://www.park-safe-la.com)** | 📊 [View Notebooks](./notebooks)

## Project Overview

**Objective**: Develop a binary classification model to predict parking citation risk (low/high) based on location and time factors.

**Key Achievements**:
- **67% accuracy** on imbalanced real-world dataset with 23M+ records
- **64% recall** for high-risk predictions (critical for user safety)
- **Production-ready** full-stack web application with modern UI
- **PDF export, shareable URLs, and offline detection** features
- **Custom design system** with animated gradients and parking-themed iconography

**Technical Stack**: Python, scikit-learn, Pandas, NumPy, Flask, React.js, Framer Motion, Tailwind CSS, localStorage API, Git

## Deployment
- **Frontend**: Vercel (React.js with automatic builds)
- **Backend**: Cloudflare Workers (serverless Flask API)
- **Model**: Pickle-serialized Random Forest (served via API endpoint)

## Architecture & Implementation

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
- **Backend**: Flask (Python) with RESTful API and ML model integration
- **Frontend**: React.js with custom hooks, Framer Motion animations, and Tailwind CSS
- **Features**:
  - **PDF Export**: Generate downloadable risk assessment reports (jsPDF integration)
  - **URL Sharing**: Shareable links with encoded search parameters
  - **Offline Detection**: Network status monitoring with user feedback
  - **Search History**: localStorage-based history with 10-item limit and duplicate prevention
  - **Interactive Timeline**: Hourly risk visualization with clickable time selection
  - **Custom UI**: Animated gradient backgrounds, parking-themed SVG icons, modern typography (Sora + Space Grotesk)
  - **Real-time Validation**: Form validation with error handling and loading states
  - **Responsive Design**: Mobile-first approach with breakpoint optimization

## Getting Started

### Prerequisites
```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies (Node.js required)
cd frontend
npm install
```

### Running the Application Locally

#### Full Stack For MacOS
1. **Start the Flask backend** (Terminal 1):
   ```bash
   python3 app.py
   ```
   Backend runs on: `http://localhost:5000`

2. **Start the React frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on: `http://localhost:3000`

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
  

## Project Structure
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

## Technical Skills Demonstrated

### Machine Learning & Data Science
- **Large-scale data processing** (23M+ records with pandas and NumPy)
- **Feature engineering** for geospatial and temporal data (haversine distance, cyclical encoding)
- **Class imbalance handling** using weighted Random Forest
- **Model persistence** and production deployment with pickle serialization

### Full-Stack Development
- **Backend**: Flask API design, request handling, CORS configuration, error management
- **Frontend**: React.js with hooks (useState, useEffect, useRef), component architecture, custom hooks
- **State Management**: localStorage API for persistent client-side data
- **Animations**: Framer Motion for smooth UI transitions and micro-interactions
- **Styling**: Tailwind CSS with custom design system and responsive breakpoints

### Software Engineering Best Practices
- **API Integration**: Asynchronous data fetching with Axios, error boundaries
- **User Experience**: Loading states, form validation, offline detection, toast notifications
- **Code Organization**: Component-based architecture, utility functions, constants management
- **Version Control**: Git workflow with feature branches and descriptive commits

## Key Takeaways for Recruiters

This project demonstrates:
- **End-to-end ML development**: From 23M raw records to production-deployed model
- **Full-stack capabilities**: Modern React frontend + Flask backend + ML integration
- **Product thinking**: User-focused features (PDF export, sharing, offline support)
- **Production-ready code**: Error handling, validation, responsive design, performance optimization
- **Real-world problem solving**: Handling imbalanced datasets and deploying ML at scale

## ⚠️ Disclaimer
ParkSafe-LA is intended purely as a safety-oriented, educational tool to help users understand trends in parking citation risk based on historical data. It must not be used to circumvent parking regulations or to justify illegal parking behavior. Always follow local parking signs and ordinances.


## Future Additions

- **Interactive mapping** with risk visualization
- **Real-time data integration** for live predictions