import requests
import json

url = "https://n8n.srv862127.hstgr.cloud/webhook/reporting"
headers = {
    "Content-Type": "application/json",
    "reporting": "reporting.01"
}
data = {
    "password": "test"
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Text: {response.text}")
    try:
        json_resp = response.json()
        print("JSON Response:", json.dumps(json_resp, indent=2))
    except Exception as e:
        print("Could not parse JSON:", e)
except Exception as e:
    print("Request failed:", e)
