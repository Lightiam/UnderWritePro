from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pandas as pd
import joblib
import numpy as np

class CreditScoringModel:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.features = ['income', 'age', 'employment_length', 'debt_to_income', 
                        'num_credit_lines', 'payment_history']
        
    def train(self, data: pd.DataFrame):
        X = data[self.features]
        y = (data['loan_amount'] > data['loan_amount'].median()).astype(int)
        
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_scaled, y)
        
    def predict(self, data: pd.DataFrame) -> dict:
        if self.model is None or self.scaler is None:
            raise ValueError("Model not trained")
            
        X = data[self.features]
        X_scaled = self.scaler.transform(X)
        
        probability = self.model.predict_proba(X_scaled)[0][1]
        credit_score = int(probability * 850)
        
        feature_importance = dict(zip(self.features, 
                                    self.model.feature_importances_))
        
        return {
            "credit_score": credit_score,
            "probability": float(probability),
            "feature_importance": feature_importance,
            "details": self._generate_details(credit_score, feature_importance)
        }
    
    def _generate_details(self, score: int, importance: dict) -> str:
        risk_level = "Low" if score >= 700 else "Medium" if score >= 600 else "High"
        top_factors = sorted(importance.items(), key=lambda x: x[1], reverse=True)[:3]
        
        details = f"Credit Score: {score} (Risk Level: {risk_level})\n\n"
        details += "Top contributing factors:\n"
        for factor, importance in top_factors:
            details += f"- {factor.replace('_', ' ').title()}: {importance:.2%}\n"
        
        return details
    
    def save(self, model_path: str, scaler_path: str):
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, scaler_path)
    
    def load(self, model_path: str, scaler_path: str):
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
