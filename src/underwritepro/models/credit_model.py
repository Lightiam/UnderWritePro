import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import numpy as np
import pandas as pd

class CreditScoringModel:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.required_columns = [
            'age', 'income', 'employment_length', 'debt_to_income',
            'num_credit_lines', 'payment_history', 'loan_amount',
            'credit_history', 'employment_duration'
        ]

    def preprocess_data(self, data):
        df = data.copy()
        
        # Convert categorical variables to numeric
        payment_history_map = {'poor': 0, 'fair': 1, 'good': 2, 'excellent': 3}
        credit_history_map = {'poor': 0, 'fair': 1, 'good': 2, 'excellent': 3}
        
        # Handle missing or invalid values
        df = df.fillna({
            'payment_history': 'fair',
            'credit_history': 'fair',
            'age': df['age'].median() if 'age' in df else 35,
            'income': df['income'].median() if 'income' in df else 50000,
            'employment_length': df['employment_length'].median() if 'employment_length' in df else 5,
            'debt_to_income': df['debt_to_income'].median() if 'debt_to_income' in df else 0.4,
            'num_credit_lines': df['num_credit_lines'].median() if 'num_credit_lines' in df else 3,
            'loan_amount': df['loan_amount'].median() if 'loan_amount' in df else 25000,
            'employment_duration': df['employment_duration'].median() if 'employment_duration' in df else 5
        })
        
        # Convert strings to lowercase and map categorical variables
        df['payment_history'] = df['payment_history'].astype(str).str.lower().map(payment_history_map)
        df['credit_history'] = df['credit_history'].astype(str).str.lower().map(credit_history_map)
        
        # Convert numeric columns to float with error handling
        numeric_columns = ['age', 'income', 'employment_length', 'debt_to_income', 
                         'num_credit_lines', 'loan_amount', 'employment_duration']
        for col in numeric_columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        return df

    def train(self, data):
        # Ensure all required columns are present
        missing_cols = set(self.required_columns) - set(data.columns)
        if missing_cols:
            raise ValueError(f"Missing required columns: {', '.join(missing_cols)}")
        
        # Preprocess the data
        processed_data = self.preprocess_data(data)
        
        # Initialize and fit the scaler
        self.scaler = StandardScaler()
        scaled_features = self.scaler.fit_transform(processed_data[self.required_columns])
        
        # Generate synthetic credit scores (600-850 range)
        credit_scores = np.random.uniform(600, 850, len(data))
        
        # Train the model with regression for continuous credit scores
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(scaled_features, credit_scores)
        
    def predict(self, data):
        # Ensure all required columns are present
        missing_cols = set(self.required_columns) - set(data.columns)
        if missing_cols:
            raise ValueError(f"Missing required columns: {', '.join(missing_cols)}")
        
        # Preprocess the data
        processed_data = self.preprocess_data(data)
        
        # Scale the features
        scaled_features = self.scaler.transform(processed_data[self.required_columns])
        
        # Make prediction (direct credit score prediction)
        credit_score = self.model.predict(scaled_features)[0]
        
        return float(credit_score)

    def save(self, model_path, scaler_path):
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, scaler_path)
        
    def load(self, model_path, scaler_path):
        try:
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
        except Exception as e:
            print(f"Error loading model: {e}")
            test_data_path = "/home/ubuntu/UnderWritePro/backend/src/underwritepro/static/test_data.csv"
            self.train(pd.read_csv(test_data_path))
            self.save(model_path, scaler_path)
