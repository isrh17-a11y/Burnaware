import numpy as np
from typing import Tuple, Dict
import pickle
import os

class BurnoutPredictor:
    """Machine learning model for predicting burnout risk"""
    
    def __init__(self, model_path: str = None):
        self.model_path = model_path
        self.model = None
        self.scaler = None
        
        # Load model if path is provided
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
    
    def predict(self, features: Dict) -> Tuple[float, str]:
        """
        Predict burnout score and risk level
        
        Args:
            features: Dictionary containing input features
            
        Returns:
            Tuple of (burnout_score, risk_level)
        """
        # Extract features in the correct order
        feature_vector = np.array([
            features.get("work_hours_per_week", 40),
            features.get("sleep_hours_per_day", 7),
            features.get("stress_level", 5),
            features.get("job_satisfaction", 5),
            features.get("work_life_balance", 5),
            features.get("physical_activity_hours", 2),
            features.get("social_support", 5)
        ]).reshape(1, -1)
        
        # If model is loaded, use it; otherwise use rule-based approach
        if self.model:
            burnout_score = float(self.model.predict(feature_vector)[0])
        else:
            burnout_score = self._calculate_burnout_score(features)
        
        # Determine risk level
        risk_level = self._get_risk_level(burnout_score)
        
        return burnout_score, risk_level
    
    def _calculate_burnout_score(self, features: Dict) -> float:
        """
        Calculate burnout score using a rule-based approach
        This is a placeholder until a trained model is available
        """
        # Normalize features to 0-1 scale
        work_hours_norm = min(features.get("work_hours_per_week", 40) / 80, 1.0)
        sleep_deficit = max(0, (8 - features.get("sleep_hours_per_day", 7)) / 8)
        stress_norm = features.get("stress_level", 5) / 10
        job_sat_norm = 1 - (features.get("job_satisfaction", 5) / 10)
        wlb_norm = 1 - (features.get("work_life_balance", 5) / 10)
        exercise_deficit = max(0, (3 - features.get("physical_activity_hours", 2)) / 3)
        social_deficit = 1 - (features.get("social_support", 5) / 10)
        
        # Weighted average
        burnout_score = (
            work_hours_norm * 0.20 +
            sleep_deficit * 0.15 +
            stress_norm * 0.25 +
            job_sat_norm * 0.15 +
            wlb_norm * 0.10 +
            exercise_deficit * 0.10 +
            social_deficit * 0.05
        ) * 100
        
        return round(burnout_score, 2)
    
    def _get_risk_level(self, burnout_score: float) -> str:
        """Determine risk level based on burnout score"""
        if burnout_score < 30:
            return "low"
        elif burnout_score < 60:
            return "medium"
        else:
            return "high"
    
    def load_model(self, model_path: str):
        """Load a trained model from disk"""
        with open(model_path, 'rb') as f:
            self.model = pickle.load(f)
    
    def save_model(self, model_path: str):
        """Save the trained model to disk"""
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
