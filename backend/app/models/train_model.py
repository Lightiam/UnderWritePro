import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib

# Generate synthetic credit data
np.random.seed(42)
n_samples = 1000

data = {
    'income': np.random.normal(60000, 20000, n_samples),
    'age': np.random.randint(18, 80, n_samples),
    'employment_length': np.random.randint(0, 40, n_samples),
    'debt_to_income': np.random.uniform(0, 1, n_samples),
    'num_credit_lines': np.random.randint(0, 20, n_samples),
    'payment_history': np.random.uniform(0, 1, n_samples),
    'loan_amount': np.random.normal(200000, 100000, n_samples)
}

# Create synthetic credit scores
credit_scores = (
    0.3 * (data['income'] / 100000) +
    0.1 * (data['age'] / 80) +
    0.1 * (data['employment_length'] / 40) +
    -0.2 * data['debt_to_income'] +
    0.1 * (data['num_credit_lines'] / 20) +
    0.3 * data['payment_history'] +
    -0.1 * (data['loan_amount'] / 300000)
)

# Scale to 300-850 range
credit_scores = 300 + (credit_scores - credit_scores.min()) * (850 - 300) / (credit_scores.max() - credit_scores.min())

# Create DataFrame and train model
df = pd.DataFrame(data)
X = df[['income', 'age', 'employment_length', 'debt_to_income', 'num_credit_lines', 'payment_history', 'loan_amount']]
y = credit_scores

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_scaled, y)

# Save model and scaler
joblib.dump(model, 'app/models/credit_scoring_model.joblib')
joblib.dump(scaler, 'app/models/feature_scaler.joblib')

print("Model trained and saved successfully!")
