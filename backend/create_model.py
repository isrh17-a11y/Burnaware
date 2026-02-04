"""
Sample script to create a simple sklearn burnout prediction model
This creates the burnout.pkl file that simple_main.py can load
"""

import numpy as np
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Generate sample training data
# In a real scenario, you would load actual survey data
np.random.seed(42)
n_samples = 500

# Generate features (7 features from questionnaire)
study_hours = np.random.uniform(10, 70, n_samples)
sleep_hours = np.random.uniform(4, 10, n_samples)
stress_level = np.random.randint(1, 11, n_samples)
academic_satisfaction = np.random.randint(1, 11, n_samples)
social_life_balance = np.random.randint(1, 11, n_samples)
physical_activity = np.random.uniform(0, 10, n_samples)
family_support = np.random.randint(1, 11, n_samples)

# Combine features
X = np.column_stack([
    study_hours,
    sleep_hours,
    stress_level,
    academic_satisfaction,
    social_life_balance,
    physical_activity,
    family_support
])

# Generate target (burnout score 0-100)
# This is a simplified formula - in reality, you'd have actual labeled data
y = (
    (study_hours / 70) * 20 +  # More study hours = more burnout
    ((10 - sleep_hours) / 10) * 20 +  # Less sleep = more burnout
    (stress_level / 10) * 25 +  # More stress = more burnout
    ((10 - academic_satisfaction) / 10) * 15 +  # Less satisfaction = more burnout
    ((10 - social_life_balance) / 10) * 10 +  # Poor balance = more burnout
    ((5 - np.minimum(physical_activity, 5)) / 5) * 5 +  # Less exercise = more burnout
    ((10 - family_support) / 10) * 5  # Less support = more burnout
)

# Add some noise to make it more realistic
y = y + np.random.normal(0, 5, n_samples)
y = np.clip(y, 0, 100)  # Keep scores between 0-100

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
print("Training Random Forest model...")
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluate
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"✅ Model trained successfully!")
print(f"📊 Training R² score: {train_score:.3f}")
print(f"📊 Testing R² score: {test_score:.3f}")

# Save model
with open('burnout.pkl', 'wb') as f:
    pickle.dump(model, f)

print(f"💾 Model saved to burnout.pkl")
print(f"\n🎉 You can now use this model with simple_main.py!")

# Test prediction
print("\n" + "="*60)
print("Testing prediction with sample data:")
print("="*60)

sample = np.array([[40, 6.5, 7, 6, 5, 3, 8]])  # Sample student data
prediction = model.predict(sample)[0]
print(f"Sample input: study=40h, sleep=6.5h, stress=7, satisfaction=6")
print(f"Predicted burnout score: {prediction:.2f}")

if prediction < 35:
    risk = "LOW"
elif prediction < 65:
    risk = "MEDIUM"
else:
    risk = "HIGH"
print(f"Risk level: {risk}")
print("="*60)
