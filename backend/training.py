"""
Training Script for Burnout Prediction Model
Reads dataset.csv, trains logistic regression, and saves burnout.pkl
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

def load_data(filepath='dataset.csv'):
    """Load the dataset from CSV file"""
    print(f"📂 Loading data from {filepath}...")
    
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file '{filepath}' not found!")
    
    df = pd.read_csv(filepath)
    print(f"✅ Data loaded successfully!")
    print(f"   Shape: {df.shape}")
    print(f"   Columns: {list(df.columns)}")
    
    return df

def prepare_features(df):
    """
    Prepare features and target variable
    
    Expected columns in dataset.csv:
    - study_hours_per_week
    - sleep_hours_per_day
    - stress_level
    - academic_satisfaction
    - social_life_balance
    - physical_activity_hours
    - family_support
    - burnout (target: 0 or 1)
    """
    print("\n🔧 Preparing features...")
    
    # Define feature columns
    feature_columns = [
        'study_hours_per_week',
        'sleep_hours_per_day',
        'stress_level',
        'academic_satisfaction',
        'social_life_balance',
        'physical_activity_hours',
        'family_support'
    ]
    
    # Check if all required columns exist
    missing_cols = [col for col in feature_columns + ['burnout'] if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing columns in dataset: {missing_cols}")
    
    # Extract features and target
    X = df[feature_columns]
    y = df['burnout']
    
    print(f"✅ Features prepared!")
    print(f"   Feature columns: {len(feature_columns)}")
    print(f"   Samples: {len(X)}")
    print(f"   Burnout cases: {y.sum()} ({y.sum()/len(y)*100:.1f}%)")
    print(f"   No burnout: {len(y) - y.sum()} ({(len(y) - y.sum())/len(y)*100:.1f}%)")
    
    return X, y, feature_columns

def train_model(X_train, y_train, feature_columns=None):
    """Train Random Forest model and analyze feature importance"""
    print("\n🤖 Training Random Forest model...")
    
    # Initialize and train the model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    print("✅ Model trained successfully!")
    
    # Feature Importance Analysis
    if feature_columns:
        print("\n📈 Feature Importance:")
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        for f in range(len(feature_columns)):
            idx = indices[f]
            print(f"   {f+1}. {feature_columns[idx]}: {importances[idx]:.4f}")
            
    return model

def evaluate_model(model, X_test, y_test):
    """Evaluate the trained model"""
    print("\n📊 Evaluating model performance...")
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n{'='*60}")
    print(f"  MODEL PERFORMANCE")
    print(f"{'='*60}")
    print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Burnout', 'Burnout']))
    print(f"\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print(f"{'='*60}\n")
    
    return accuracy

def save_model(model, scaler, feature_columns, filepath='burnout.pkl'):
    """Save the trained model using joblib"""
    print(f"💾 Saving model to {filepath}...")
    
    # Save model, scaler, and feature columns together
    model_data = {
        'model': model,
        'scaler': scaler,
        'feature_columns': feature_columns
    }
    
    joblib.dump(model_data, filepath)
    
    file_size = os.path.getsize(filepath) / 1024  # Size in KB
    print(f"✅ Model saved successfully!")
    print(f"   File: {filepath}")
    print(f"   Size: {file_size:.2f} KB")

def main():
    """Main training pipeline"""
    print("\n" + "="*60)
    print("  BURNOUT PREDICTION MODEL TRAINING")
    print("="*60 + "\n")
    
    try:
        # 1. Load data
        df = load_data('dataset.csv')
        
        # 2. Prepare features
        X, y, feature_columns = prepare_features(df)
        
        # 3. Split data
        print("\n📊 Splitting data into train/test sets...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        print(f"   Training set: {len(X_train)} samples")
        print(f"   Test set: {len(X_test)} samples")
        
        # 4. Scale features
        print("\n⚖️  Scaling features...")
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        print("✅ Features scaled!")
        
        # 5. Train model
        model = train_model(X_train_scaled, y_train, feature_columns)
        
        # 6. Evaluate model
        accuracy = evaluate_model(model, X_test_scaled, y_test)
        
        # 7. Save model
        save_model(model, scaler, feature_columns, 'burnout.pkl')
        
        print("\n" + "="*60)
        print("  ✅ TRAINING COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("\n📝 Next steps:")
        print("   1. Use 'burnout.pkl' in your FastAPI application")
        print("   2. The model expects these features in order:")
        for i, col in enumerate(feature_columns, 1):
            print(f"      {i}. {col}")
        print("\n🚀 You can now run: python main.py or python simple_main.py")
        print("="*60 + "\n")
        
    except FileNotFoundError as e:
        print(f"\n❌ ERROR: {e}")
        print("\n💡 TIP: Make sure 'dataset.csv' exists in the backend folder")
        print("   Expected columns:")
        print("   - study_hours_per_week")
        print("   - sleep_hours_per_day")
        print("   - stress_level")
        print("   - academic_satisfaction")
        print("   - social_life_balance")
        print("   - physical_activity_hours")
        print("   - family_support")
        print("   - burnout (target: 0 or 1)")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
