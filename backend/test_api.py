"""
Test script for the BurnAware API
Run this after starting simple_main.py to test all endpoints
"""

import requests
import json

BASE_URL = "http://localhost:10000"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_root():
    print_section("Testing Root Endpoint")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_create_student():
    print_section("Creating a Student")
    student_data = {
        "name": "Alice Johnson",
        "email": "alice.johnson@university.edu",
        "age": 21,
        "major": "Computer Science",
        "year": "Junior"
    }
    response = requests.post(f"{BASE_URL}/students", json=student_data)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json().get("student", {}).get("id")

def test_get_students():
    print_section("Getting All Students")
    response = requests.get(f"{BASE_URL}/students")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_predict(student_id):
    print_section("Making a Burnout Prediction")
    questionnaire = {
        "student_id": student_id,
        "student_name": "Alice Johnson",
        "study_hours_per_week": 45,
        "sleep_hours_per_day": 6,
        "stress_level": 8,
        "academic_satisfaction": 5,
        "social_life_balance": 4,
        "physical_activity_hours": 2,
        "family_support": 7
    }
    response = requests.post(f"{BASE_URL}/predict", json=questionnaire)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_get_predictions():
    print_section("Getting All Predictions")
    response = requests.get(f"{BASE_URL}/predictions")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def main():
    print("\n" + "🧪 BurnAware API Test Suite".center(60, "="))
    print("Make sure simple_main.py is running on http://localhost:10000")
    print("="*60)
    
    try:
        # Test root
        test_root()
        
        # Create student
        student_id = test_create_student()
        
        # Get students
        test_get_students()
        
        # Make prediction
        if student_id:
            test_predict(student_id)
        
        # Get predictions
        test_get_predictions()
        
        print_section("✅ All Tests Completed!")
        print("Check the results above to verify everything is working.")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to the API")
        print("Make sure simple_main.py is running:")
        print("  python simple_main.py")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    main()
