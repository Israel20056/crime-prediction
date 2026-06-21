import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

random.seed(42)
np.random.seed(42)

# Nigerian states with realistic crime weight distribution
states = {
    "Lagos": 0.18,
    "Abuja (FCT)": 0.10,
    "Rivers": 0.09,
    "Kano": 0.08,
    "Borno": 0.08,
    "Kaduna": 0.07,
    "Delta": 0.06,
    "Oyo": 0.05,
    "Anambra": 0.05,
    "Imo": 0.04,
    "Enugu": 0.03,
    "Plateau": 0.03,
    "Niger": 0.02,
    "Zamfara": 0.03,
    "Sokoto": 0.02,
    "Ogun": 0.02,
    "Edo": 0.02,
    "Cross River": 0.01,
    "Bauchi": 0.01,
    "Kebbi": 0.01,
}

crime_types = [
    "Armed Robbery",
    "Kidnapping",
    "Cybercrime",
    "Assault",
    "Terrorism",
    "Cult Clash",
    "Burglary",
    "Fraud",
    "Drug Trafficking",
    "Homicide",
]

# Approximate lat/lng centers per state
state_coords = {
    "Lagos": (6.5244, 3.3792),
    "Abuja (FCT)": (9.0765, 7.3986),
    "Rivers": (4.8156, 7.0498),
    "Kano": (12.0022, 8.5920),
    "Borno": (11.8333, 13.1500),
    "Kaduna": (10.5222, 7.4383),
    "Delta": (5.5320, 5.8987),
    "Oyo": (7.8500, 3.9333),
    "Anambra": (6.2209, 6.9370),
    "Imo": (5.5720, 7.0588),
    "Enugu": (6.4584, 7.5464),
    "Plateau": (9.2182, 9.5175),
    "Niger": (9.6139, 6.5569),
    "Zamfara": (12.1704, 6.6624),
    "Sokoto": (13.0059, 5.2476),
    "Ogun": (7.1600, 3.3500),
    "Edo": (6.3350, 5.6037),
    "Cross River": (5.8702, 8.5988),
    "Bauchi": (10.3158, 9.8442),
    "Kebbi": (11.4942, 4.2333),
}

records = []
start_date = datetime(2020, 1, 1)
end_date = datetime(2024, 12, 31)
total_days = (end_date - start_date).days

state_names = list(states.keys())
state_weights = list(states.values())

for _ in range(5000):
    state = random.choices(state_names, weights=state_weights, k=1)[0]
    crime = random.choices(crime_types, k=1)[0]
    rand_days = random.randint(0, total_days)
    date = start_date + timedelta(days=rand_days)
    lat, lng = state_coords[state]
    lat += random.uniform(-0.5, 0.5)
    lng += random.uniform(-0.5, 0.5)
    fatalities = random.choices(
        [0, 1, 2, 3, 4, 5],
        weights=[0.50, 0.25, 0.12, 0.07, 0.04, 0.02],
        k=1
    )[0]

    records.append({
        "date": date.strftime("%Y-%m-%d"),
        "year": date.year,
        "month": date.strftime("%B"),
        "month_num": date.month,
        "state": state,
        "crime_type": crime,
        "latitude": round(lat, 4),
        "longitude": round(lng, 4),
        "fatalities": fatalities,
    })

df = pd.DataFrame(records)
df = df.sort_values("date").reset_index(drop=True)
df.to_csv("nigeria_crime.csv", index=False)
print(f"Dataset generated: {len(df)} records saved to nigeria_crime.csv")
print(df.head())
print("\nCrime type distribution:")
print(df["crime_type"].value_counts())
print("\nTop states:")
print(df["state"].value_counts().head(5))