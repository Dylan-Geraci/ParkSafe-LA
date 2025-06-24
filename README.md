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
- **Tech Stack**: Python, Pandas, NumPy, scikit-learn, Matplotlib, Google Colab

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
- Grouped data by ZIP × hour × weekday to count citations
- Assigned a **binary risk label** based on grouped ticket volume

### 2. Model Training
- Trained a **Random Forest Classifier** (`n_estimators=100`, `max_depth=15`, `class_weight='balanced'`)
- Evaluated using:
  - **Accuracy**: 67%
  - **Macro F1-score**: 0.66
  - **High-risk recall**: 64%
- Visualized confusion matrix and top 15 feature importances

---

## 📁 Key Files

| File | Description |
|------|-------------|
| `preprocessing.ipynb` | Cleans, engineers, and exports the final modeling dataset |
| `model.ipynb`         | Trains and evaluates the binary classifier |
| `parksafe_model.pkl`  | Saved trained model for reuse or deployment |
| `Grouped_df.csv`      | Final processed dataset used in model training |

---

## 🧠 Skills Demonstrated

- End-to-end machine learning workflow using **real-world, high-volume data**
- Geospatial feature engineering with haversine distance
- Handling **imbalanced classification** using `class_weight='balanced'`
- Performance tuning for **recall-driven objectives**
- Visualization of model decisions and feature importance

---

## 🚀 Future Extensions
- Deploy as a REST API or web app to provide live parking risk forecasts
- Integrate interactive maps to visualize risk by ZIP and time
- Include citation type, fine amount, or car make for deeper insights
