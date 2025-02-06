import joblib
import numpy as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CreditScoringModel:
    def __init__(self):
        self.model = None
        self.scaler = None
        
    def load(self, model_path: str, scaler_path: str) -> None:
        try:
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            logger.info("Model and scaler loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.scaler = StandardScaler()
            logger.info("Using default model configuration")
    
    def predict(self, data: pd.DataFrame) -> float:
        try:
            required_features = [
                'age', 'income', 'employment_length', 'debt_to_income',
                'num_credit_lines', 'payment_history', 'loan_amount',
                'credit_history', 'employment_duration'
            ]
            
            missing_cols = [col for col in required_features if col not in data.columns]
            if missing_cols:
                raise ValueError(f"Missing required columns: {', '.join(missing_cols)}")
            
            data = data[required_features]
            scaled_data = self.scaler.transform(data)
            prediction = self.model.predict(scaled_data)
            
            return float(prediction[0])
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            raise
