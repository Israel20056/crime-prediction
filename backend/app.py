from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load data once at startup
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(BASE_DIR, '..', 'preprocessing', 'nigeria_crime.csv'))

@app.route('/api/crimes', methods=['GET'])
def get_crimes():
    state = request.args.get('state')
    crime_type = request.args.get('crime_type')
    year = request.args.get('year')

    filtered = df.copy()
    if state:
        filtered = filtered[filtered['state'] == state]
    if crime_type:
        filtered = filtered[filtered['crime_type'] == crime_type]
    if year:
        filtered = filtered[filtered['year'] == int(year)]

    return jsonify(filtered.to_dict(orient='records'))


@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_crimes = len(df)
    total_fatalities = int(df['fatalities'].sum())
    top_state = df['state'].value_counts().idxmax()
    top_crime = df['crime_type'].value_counts().idxmax()

    crimes_by_type = df['crime_type'].value_counts().to_dict()
    crimes_by_state = df['state'].value_counts().head(10).to_dict()
    crimes_by_year = df['year'].value_counts().sort_index().to_dict()
    crimes_by_month = df.groupby('month_num')['crime_type'].count().to_dict()

    return jsonify({
        'total_crimes': total_crimes,
        'total_fatalities': total_fatalities,
        'top_state': top_state,
        'top_crime': top_crime,
        'crimes_by_type': crimes_by_type,
        'crimes_by_state': crimes_by_state,
        'crimes_by_year': crimes_by_year,
        'crimes_by_month': crimes_by_month,
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    body = request.get_json()
    state = body.get('state', '')
    crime_type = body.get('crimeType', '')
    time_of_day = body.get('timeOfDay', '')
    month = body.get('month', '')

    state_risk = {
        'Lagos': 90, 'Borno': 88, 'Kaduna': 82, 'Zamfara': 85,
        'Rivers': 78, 'Abuja (FCT)': 72, 'Kano': 70, 'Delta': 68,
        'Oyo': 60, 'Anambra': 58, 'Imo': 55, 'Plateau': 65,
        'Enugu': 50, 'Niger': 48, 'Sokoto': 75, 'Ogun': 45,
        'Edo': 52, 'Cross River': 40, 'Bauchi': 55, 'Kebbi': 42,
    }
    crime_risk = {
        'Terrorism': 95, 'Kidnapping': 90, 'Homicide': 88,
        'Armed Robbery': 82, 'Cult Clash': 78, 'Drug Trafficking': 70,
        'Assault': 65, 'Burglary': 55, 'Fraud': 50, 'Cybercrime': 45,
    }
    time_risk = {
        'Night (10pm–6am)': 90, 'Evening (6pm–10pm)': 70,
        'Afternoon (12pm–6pm)': 40, 'Morning (6am–12pm)': 30,
    }
    month_risk = {
        'December': 90, 'January': 85, 'November': 70,
        'October': 65, 'April': 60, 'March': 55,
        'February': 50, 'May': 50, 'June': 48,
        'July': 45, 'August': 45, 'September': 48,
    }

    score = 0
    score += state_risk.get(state, 50) * 0.35
    score += crime_risk.get(crime_type, 50) * 0.30
    score += time_risk.get(time_of_day, 50) * 0.20
    score += month_risk.get(month, 50) * 0.15
    score = min(round(score), 99)

    if score >= 75:
        level = 'HIGH RISK'
    elif score >= 50:
        level = 'MODERATE RISK'
    else:
        level = 'LOW RISK'

    return jsonify({'score': score, 'level': level})


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'records': len(df)})


if __name__ == '__main__':
    app.run(debug=True, port=5000)