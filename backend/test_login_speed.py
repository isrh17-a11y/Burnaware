import requests
import time

BASE_URL = "http://localhost:8000/api/users"

def test_login_speed():
    # 1. Register a test user (if not exists)
    email = "speedtest@example.com"
    password = "password123"
    
    try:
        requests.post(f"{BASE_URL}/register", json={
            "email": email,
            "password": password,
            "username": "speedtest",
            "full_name": "Speed Test"
        })
    except:
        pass # User might exist
        
    # 2. Measure Login Time
    start_time = time.time()
    response = requests.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password
    })
    end_time = time.time()
    
    latency = (end_time - start_time) * 1000
    print(f"Login Response Status: {response.status_code}")
    print(f"Login Latency: {latency:.2f} ms")
    
    if latency > 500:
        print("WARNING: Login is taking longer than 500ms!")
    else:
        print("Login speed is acceptable.")

if __name__ == "__main__":
    test_login_speed()
