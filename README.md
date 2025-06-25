# 🚗 ParkSafe-LA: Parking Citation Risk Predictor

A machine learning system that predicts parking citation risk in Los Angeles using real-world data from 23+ million citation records. The project includes both the ML model and a production-ready web application.

## 📊 Project Overview

**Objective**: Develop a binary classification model to predict parking citation risk (low/high) based on location and time factors.

**Key Achievements**:
- **67% accuracy** on imbalanced real-world dataset
- **64% recall** for high-risk predictions
- **Production deployment** via Flask web application
- **23M+ records** processed and analyzed

**Technical Stack**: Python, scikit-learn, Pandas, NumPy, Flask, HTML, Git

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
- **Framework**: Flask (Python)
- **Frontend**: HTML, CSS
- **Features**:
  - Real-time prediction interface
  - Input validation and error handling
  - Automatic feature preprocessing

## 🚀 Getting Started

### Prerequisites
```bash
pip install flask joblib scikit-learn pandas numpy
```

### Running the Application
1. **Start the server**:
   ```bash
   python app.py
   ```

2. **Access the web interface**:
   ```
   http://127.0.0.1:5000
   ```

3. **Make predictions**:
   - Enter ZIP code (e.g., 90001 for downtown LA)
   - Select day of week
   - Choose hour and AM/PM
   - Get instant risk assessment

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
├── app.py 
├── models/
│   └── parksafe_model_v1.pkl 
├── templates/
│   └── index.html
├── notebooks/
│   ├── pre_processing.ipynb
│   └── modeling.ipynb        
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

## 🔮 Future Enhancements

- **Cloud deployment** (AWS or Azure)
- **Interactive mapping** with risk visualization
- **Real-time data integration** for live predictions
