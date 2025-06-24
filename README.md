# 🚗 ParkSafe-LA: Parking Citation Risk Predictor

ParkSafe-LA is a machine learning project that analyzes real-world parking citation data from the city of Los Angeles to predict whether a driver is likely to receive a ticket based on **ZIP code**, **hour of the day**, and **day of the week**.

The model was trained on over **23 million records**, making it a robust, large-scale application of machine learning to geospatial risk prediction.

---

## 📊 Project Overview

- **Goal**: Predict binary parking citation risk (`low` or `high`) by time and location
- **Data Size**: 23M+ rows of real-world citation data
- **Key Performance**:
  - **Accuracy**: 67%
  - **Macro F1-Score**: 0.66
  - **Recall (High Risk)**: 64%
- **Model**: Random Forest Classifier with class balancing and feature optimization
- **Tech Stack**: Python, Pandas, NumPy, scikit-learn, Matplotlib, Google Colab, Flask

---

## 🌐 Web Application

A **Flask web application** has been created to provide an interactive interface for the ParkSafe-LA model.

### Features
- **User-friendly form** for inputting ZIP code, day of week, hour, and AM/PM
- **Real-time predictions** showing "Low" or "High" parking citation risk
- **Clean, responsive design** with modern styling
- **Automatic feature preprocessing** (cyclical hour encoding, ZIP code one-hot encoding, day label encoding)

### How to Run the Web App

1. **Install dependencies:**
   ```bash
   pip install flask joblib scikit-learn pandas numpy
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Open your browser** and go to: `http://127.0.0.1:5000`

4. **Enter your details:**
   - ZIP Code (e.g., 90001 for downtown LA)
   - Day of the Week (dropdown selection)
   - Hour (1-12)
   - AM/PM selection

5. **Get your risk prediction** instantly!

### Example Usage
- **ZIP Code**: 90001 (Downtown LA)
- **Day**: Monday
- **Time**: 9 AM
- **Result**: Risk Level: High

---

## 🗂️ Data Sources

- 📍 **U.S. ZIP Code Geolocation Data**:  
  https://download.geonames.org/export/zip/

- 🚗 **LA Parking Citation Records**:  
  https://data.lacity.org/Transportation/Parking-Citations/4f5p-udkv/about_data

---

## ⚙️ Workflow Summary

### 1. Data Preprocessing
- Cleaned over 23 million citation records and filtered to valid latitude/longitude ranges within LA
- Used **haversine BallTree** to map citation coordinates to the nearest **Los Angeles County ZIP code**
- Engineered time-based features (cyclical hour encoding, weekday labels)
- One-hot encoded ZIP codes and consolidated rare ZIPs
- Assigned a **binary risk label** based on grouped ticket volume

### 2. Model Training
- Trained a **Random Forest Classifier** (`n_estimators=100`, `max_depth=15`, `class_weight='balanced'`)
- Evaluated using:
  - **Accuracy**: 67%
  - **Macro F1-score**: 0.66
  - **High-risk recall**: 64%
- Visualized confusion matrix and top 15 feature importances

### 3. Web Application Development
- Created Flask backend to serve the trained model
- Built HTML/CSS frontend with form inputs and result display
- Implemented automatic feature preprocessing to match model expectations
- Added proper error handling and input validation

---

## 📁 Key Files

| File | Description |
|------|-------------|
| `pre_processing.ipynb` | Cleans, engineers, and exports the final modeling dataset |
| `modeling.ipynb` | Trains and evaluates the binary classifier |
| `parksafe_model_v1.pkl` | Saved trained model for reuse or deployment |
| `app.py` | **Flask web application backend** |
| `templates/index.html` | **Web application frontend template** |

---

## 🧠 Skills Demonstrated

- End-to-end machine learning workflow using **real-world, high-volume data**
- Geospatial feature engineering with haversine distance
- Handling **imbalanced classification**
- Performance tuning for **recall-driven objectives**
- Visualization of model decisions and feature importance
- **Web application development** with Flask
- **Model deployment** and real-time prediction serving

---

## 🚀 Future Extensions
- Deploy to cloud platforms (Heroku, AWS, Google Cloud)
- Integrate interactive maps to visualize risk by ZIP and time
- Include citation type, fine amount, or car make for deeper insights
- Add user accounts and prediction history
- Create mobile app version
