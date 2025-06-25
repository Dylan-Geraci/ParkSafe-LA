import os
from flask import Flask, render_template, request
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load the trained model (update path if needed)
MODEL_PATH = os.path.join(os.path.dirname(
    __file__), 'models', 'parksafe_model_v1.pkl')
model = joblib.load(MODEL_PATH)

# List of all ZIP codes used in training (update as needed)
# For now, we will extract from model.feature_names_in_ if available
try:
    FEATURE_NAMES = model.feature_names_in_
except AttributeError:
    FEATURE_NAMES = None  # fallback if not available

# List of days for dropdown
DAYS_OF_WEEK = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', days=DAYS_OF_WEEK)


@app.route('/predict', methods=['POST'])
def predict():
    zipcode = request.form['zipcode']
    day_of_week = request.form['day_of_week']
    hour = int(request.form['hour'])
    am_pm = request.form['am_pm']

    # Convert hour + AM/PM to 24-hour format
    if am_pm == 'PM' and hour != 12:
        hour += 12
    if am_pm == 'AM' and hour == 12:
        hour = 0

    # Cyclical encoding for hour
    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)

    # One-hot encode ZIP code
    zip_features = {}
    found_zip = False
    if FEATURE_NAMES is not None:
        for feat in FEATURE_NAMES:
            if feat.startswith('zip_'):
                if feat == f'zip_{zipcode}':
                    zip_features[feat] = True
                    found_zip = True
                else:
                    zip_features[feat] = False
        # If not found, set zip_other to True if present
        if not found_zip and 'zip_other' in zip_features:
            zip_features['zip_other'] = True
    else:
        # fallback: just zip_other
        zip_features = {f'zip_{zipcode}': True}

    # Map day of week to label encoding
    day_label_map = {
        'Friday': 0,
        'Monday': 1,
        'Saturday': 2,
        'Sunday': 3,
        'Thursday': 4,
        'Tuesday': 5,
        'Wednesday': 6
    }
    day_of_week_encoded = day_label_map[day_of_week]

    # Build input DataFrame
    input_dict = {
        'day_of_week': day_of_week_encoded,
        'hour_sin': hour_sin,
        'hour_cos': hour_cos,
        **zip_features
    }
    X = pd.DataFrame([input_dict])

    # Align columns with model
    if FEATURE_NAMES is not None:
        X = X.reindex(columns=FEATURE_NAMES, fill_value=False)

    # Predict
    print(X)
    pred = model.predict(X)[0]
    proba = model.predict_proba(X)[0]
    print("Prediction probabilities:", proba)
    print("Prediction:", pred)
    print("Prediction type:", type(pred))
    risk = 'High' if pred == 0 else 'Low'

    return render_template('index.html', days=DAYS_OF_WEEK, result=f'Risk Level: {risk}')


if __name__ == '__main__':
    app.run(debug=True)
