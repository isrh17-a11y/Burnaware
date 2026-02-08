
import requests
import json

BASE_URL = "http://localhost:10000/api"

def test_prediction():
    # 1. Login to get a valid user ID (or just use a known one if we assume it exists)
    # Let's assume user_id=1 exists or create one.
    # Actually, let's just try to create a prediction for user_id=1. 
    # The endpoint takes user_id as query param currently (based on previous code).
    
    url = f"{BASE_URL}/predictions?user_id=2" # Using 2 as we saw it in previous outputs
    
    payload = {
        "work_hours_per_week": 40.0,
        "sleep_hours_per_day": 7.0,
        "stress_level": 5,
        "job_satisfaction": 5,
        "work_life_balance": 5,
        "physical_activity_hours": 3.0,
        "social_support": 5
    }
    
    print(f"Sending payload to {url}:")
    print(json.dumps(payload, indent=2))
    
    try:
        response = requests.post(url, json=payload)
        display_response(response)
        
        # Test edge case: stress=10 -> job_satisfaction=0
        print("\nTesting edge case (stress=10, satisfaction=0):")
        payload["stress_level"] = 10
        payload["job_satisfaction"] = 0
        response = requests.post(url, json=payload)
        display_response(response)
        
    except Exception as e:
        print(f"Error: {e}")

def display_response(response):
    print(f"Status Code: {response.status_code}")
    try:
        print("Response Body:")
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)

if __name__ == "__main__":
    test_prediction()
