import pandas as pd
import numpy as np
from app.models.credit_model import CreditScoringModel
import os
from pathlib import Path

# Set up paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
STATIC_DIR = BASE_DIR / "static"

# Create directories
STATIC_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

# Generate sample training data
np.random.seed(42)
n_samples = 1000

data = {
    'income': np.random.normal(60000, 20000, n_samples),
    'age': np.random.normal(35, 10, n_samples),
    'employment_length': np.random.normal(7, 3, n_samples),
    'debt_to_income': np.random.normal(0.3, 0.1, n_samples),
    'num_credit_lines': np.random.normal(4, 2, n_samples),
    'payment_history': np.random.normal(0.8, 0.1, n_samples),
    'loan_amount': np.random.normal(200000, 50000, n_samples)
}

# Clean up data
df = pd.DataFrame(data)
df['age'] = df['age'].clip(21, 80)
df['employment_length'] = df['employment_length'].clip(0, 40)
df['debt_to_income'] = df['debt_to_income'].clip(0, 1)
df['num_credit_lines'] = df['num_credit_lines'].clip(0, 15).round()
df['payment_history'] = df['payment_history'].clip(0, 1)
df['loan_amount'] = df['loan_amount'].clip(10000, 500000)

# Train and save model
model = CreditScoringModel()
model.train(df)

# Save model and scaler
model.save(
    str(MODELS_DIR / "credit_scoring_model.joblib"),
    str(MODELS_DIR / "feature_scaler.joblib")
)

# Save sample test data
test_data = df.iloc[[0]].copy()
test_data.to_csv(str(STATIC_DIR / "test_data.csv"), index=False)

print("Model trained and saved successfully!")
print("Sample test data saved to test_data.csv")
