import pandas as pd
import firebase_admin
from firebase_admin import firestore
import requests
import uuid

# set to actual api key.
GOOGLE_MAPS_API_KEY = "AIzaSyC1nLE4um7Ae_bjHkQllgCwAmNtEOg1t1U"

crash_type_mapping = {
    "1": "Same Direction (Rear End)",
    "2": "Same Direction (Side Swipe)",
    "3": "Right Angle",
    "4": "Opposite Direction (Head on, Angular)",
    "5": "Opposite Direction (Side Swipe)",
    "6": "Struck Parked Vehicle",
    "7": "Left Turn/U Turn",
    "8": "Backing",
    "9": "Encroachment",
    "10": "Overturned",
    "11": "Fixed Object",
    "12": "Animal",
    "13": "Pedestrian",
    "14": "Pedalcyclist",
    "15": "Non-fixed Object",
    "16": "Railcar-vehicle",
    "17": "Other",
}

# initialize firebase
cred_obj = firebase_admin.credentials.Certificate('cert.json')
default_app = firebase_admin.initialize_app(cred_obj)
db = firestore.client(database_id='montclair-crashes')
crashes_db = db.collection('crashes')

# read excel data
df = pd.read_excel("all-crash-injury-2021-2023.xlsx", sheet_name="crashes")

# upload to firebase 
for index, row in df.iterrows():
    if index > 110:
        location = row["Location"].replace("\n", " ")
        location += " Montclair NJ USA"

        parameters = f"key={GOOGLE_MAPS_API_KEY}&address={location}"
        
        # geocode location
        geocode_result = requests.post("https://places.googleapis.com/v1/places:searchText", headers={'Content-Type': 'application/json', 'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY, 'X-Goog-FieldMask': 'places.location'}, json={"textQuery" : location})
        
        geocode_result_json = geocode_result.json()

        position = geocode_result_json['places'][0]['location']

        # convert crash type list to map
        crash_type_string = row["Crash-type"]
        if isinstance(crash_type_string, int):
            crash_type_arr = [str(crash_type_string)]

            crash_type_count = {}
            for crash in crash_type_arr:
                if crash not in crash_type_count:
                    crash_type_count[crash] = 1
                else :
                    crash_type_count[crash] += 1

            # create crash type string for description
            crash_type_str = ""
            for crash_index, (crash_type, crash_count) in enumerate(crash_type_count.items()):
                if crash_index == 0:
                    crash_type_str += " The data reports that "
                else:
                    crash_type_str += ", "

                if crash_index == len(list(crash_type_count)) - 1:
                    crash_type_str += "and "
                crash_type_str += f"{crash_count} of the crashes {"were" if crash_count != 1 else "was"} classified as{"" if crash_count != 1 else " an" if crash_type in ['4', '5', '9', '10', '12', '17'] else " a"} '{crash_type_mapping[crash_type]}' crash{"es" if crash_count > 1 else ""}"
                if crash_index == len(list(crash_type_count))- 1:
                    crash_type_str += "."

            new_crash = {
                "newsLink": 'https://www.montclairnjusa.org/Government/Advisory-Committee-Boards-and-Commissions/Montclair-Vision-Zero-Task-Force/Montclairs-Data', 
                "source": "Township Crash Data",
                "placeDescription": row["Location"].replace("\n", " "),
                "crashCount": row["Number"],
                "fatalities": row["Fatalities"],
                "injuries": row["Injuries"],
                "position": position,
                "crashTypeMap": crash_type_count,
                "severity": "f" if row["Injury-type"] == "Fatal" else "s" if row["Injury-type"] == "Serious" else "m" if row["Injury-type"] == "Minor" else "p",
                "description": f"""Montclair township's crash data reported that {row['Number']} total crashe{'s' if row['Number'] != 1 else ''} occurred between 2021 and 2023 at {row['Location'].replace("\n", " ")}. These crashes resulted in {row['Fatalities']} fatalities and {row["Injuries"]} injuries. {'' if row["Injury-type"] == "Fatal" else f"The most serious injury caused by these crashes was classified as a {row['Injury-type']} injury."}{crash_type_str}""",
                "date": "2021-2023"
            }
            print("Uploaded new crash:")
            print(new_crash)

            # Add crash data to firebase
            doc_ref = crashes_db.add(new_crash)
            print(f"Document added with ID: {doc_ref[1].id}")
        else:
            crash_type_string = crash_type_string.replace("\n", "")
            crash_type_string = crash_type_string.replace(" ", "")
            crash_type_arr = crash_type_string.split(",")
