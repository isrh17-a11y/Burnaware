import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import pickle

class ModelTrainer:
    """Train and evaluate burnout prediction models"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            "work_hours_per_week",
            "sleep_hours_per_day",
            "stress_level",
            "job_satisfaction",
            "work_life_balance",
            "physical_activity_hours",
            "social_support"
        ]
    
    def prepare_data(self, data_path: str):
        """Load and prepare training data"""
        # TODO: Load actual dataset
        # For now, this is a placeholder
        df = pd.read_csv(data_path)
        
        X = df[self.feature_names]
        y = df['burnout_score']
        
        return train_test_split(X, y, test_size=0.2, random_state=42)
    
    def train(self, X_train, y_train):
        """Train the model"""
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train Random Forest model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train_scaled, y_train)
    
    def evaluate(self, X_test, y_test):
        """Evaluate the model"""
        X_test_scaled = self.scaler.transform(X_test)
        predictions = self.model.predict(X_test_scaled)
        
        mse = mean_squared_error(y_test, predictions)
        r2 = r2_score(y_test, predictions)
        
        return {
            "mse": mse,
            "rmse": np.sqrt(mse),
            "r2": r2
        }
    
    def save_model(self, model_path: str, scaler_path: str):
        """Save trained model and scaler"""
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
        
        with open(scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)

if __name__ == "__main__":
    # Example training script
    trainer = ModelTrainer()
    
    # TODO: Provide actual data path
    # X_train, X_test, y_train, y_test = trainer.prepare_data("data/burnout_data.csv")
    # trainer.train(X_train, y_train)
    # metrics = trainer.evaluate(X_test, y_test)
    # print(f"Model Performance: {metrics}")
    # trainer.save_model("models/burnout_model.pkl", "models/scaler.pkl")
    
    print("Model trainer ready. Provide training data to begin.")
