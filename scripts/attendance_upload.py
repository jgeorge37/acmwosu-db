import pandas as pd
import numpy as np
import requests
import warnings


# SETUP
# set to your base URL
base_url = 'http://localhost:3000'
RECORD_ATTENDANCE_URL = base_url + '/api/attendance/record'
CREATE_MEETING_URL = base_url + '/api/meeting/create'
# set to your auth token - directions for retrieval in API section of readme
AUTH_TOKEN = ""
HEADERS = {"Authorization": "Bearer " + AUTH_TOKEN}
# set to the path of your csv, example csv is in scripts directory
PATH_TO_CSV = './AU20_attendance.csv'
SEMESTER = 'AU20'

# load csv
df = pd.read_csv(PATH_TO_CSV,parse_dates=['Date'])
print(df.head(5))
data_arr = np.array(df.iloc[:,:])

# iterate through entries
for row in data_arr:
    # create meeting
    if not pd.isnull(row[5]):
        data = {
            'meeting_name': row[4],
            'meeting_date': row[5].strftime('%Y-%m-%d %H:%M:%S'),
            'semester': SEMESTER,
            'company_ids': []
        }
        r = requests.post(url = CREATE_MEETING_URL, json = data, headers=HEADERS)
        if r.status_code == 200:
            meeting_code = r.json()['code']
            print('Created meeting ' + row[4])
        else:
            print('error creating meeting')    
    # record attendance
    data = {
        'event_code': meeting_code,
        'f_name': row[0],
        'l_name_dot_num': row[1],
        'year_level': row[2],
        'list_serv': row[3],
        'disable_expr': True
    }
    r = requests.post(url = RECORD_ATTENDANCE_URL, json = data, headers=HEADERS)

    if r.status_code != 200:
        print('error recording student attendance')
