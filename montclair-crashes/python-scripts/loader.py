import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred_obj = firebase_admin.credentials.Certificate('cert.json')
default_app = firebase_admin.initialize_app(cred_obj)
db = firestore.client()

doc = db.collection("crashes").document("078bad38-921c-40ad-b325-b99570f0a736")
print(doc)
df = pd.read_excel("all-crash-injury-2021-2023.xlsx", sheet_name="crashes")

for index, row in df.iterrows():
    if index < 10:
        new_crash = {
            "newsLink": 'https://www.montclairnjusa.org/Government/Advisory-Committee-Boards-and-Commissions/Montclair-Vision-Zero-Task-Force/Montclairs-Data', 
            "source": "Township Crash Data",
            "placeDescription": row["Location"],
            "crashCount": row["Number"],
            "fatalities": row["Fatalities"],
            "injuries": row["Injuries"],
            "position": "",
            "severity": "f" if row["Injury-type"] == "Fatal" else "s" if row["Injury-type"] == "Serious" else "m" if row["Injury-type"] == "Minor" else "p",
            "description": f"""Montclair township's crash data reported that {row['Number']} total crashe{'s' if row['Number'] != 1 else ''} occurred between 2021 and 2023 at {row['Location']}. These crashes resulted in {row['Fatalities']} fatalities and {row["Injuries"]} injuries. {'' if row["Injury-type"] == "Fatal" else f"The most serious injury caused by these crashes was classified as a {row['Injury-type']} injury."}""",
            "date": "2021-2023"
        }
        print(new_crash)
#print(df)
