import pandas as pd
import numpy as np
from underwritepro.models.credit_model import CreditScoringModel
import os
from pathlib import Path

# Set up paths
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

# Create directories
STATIC_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

# Generate sample training data
np.random.seed(42)
n_samples = 1000

# Generate random data
ages = np.random.normal(35, 10, n_samples).clip(21, 80)
incomes = np.random.normal(60000, 20000, n_samples).clip(20000, 200000)
employment_lengths = np.random.normal(7, 3, n_samples).clip(0, 40)
debt_to_income = np.random.normal(0.3, 0.1, n_samples).clip(0, 1)
num_credit_lines = np.random.normal(4, 2, n_samples).clip(0, 15).round()
loan_amounts = np.random.normal(200000, 50000, n_samples).clip(10000, 500000)

# Generate categorical data
payment_history_categories = ['poor', 'fair', 'good', 'excellent']
credit_history_categories = ['poor', 'fair', 'good', 'excellent']

payment_history = np.random.choice(payment_history_categories, n_samples, p=[0.1, 0.2, 0.4, 0.3])
credit_history = np.random.choice(credit_history_categories, n_samples, p=[0.1, 0.2, 0.4, 0.3])

data = {
    'age': ages,
    'income': incomes,
    'employment_length': employment_lengths,
    'debt_to_income': debt_to_income,
    'num_credit_lines': num_credit_lines,
    'payment_history': payment_history,
    'loan_amount': loan_amounts,
    'credit_history': credit_history,
    'employment_duration': employment_lengths  # Using same as employment_length for simplicity
}

# Create DataFrame
df = pd.DataFrame(data)

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
