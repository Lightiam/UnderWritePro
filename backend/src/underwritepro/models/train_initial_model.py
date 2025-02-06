import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib

# Generate sample data
np.random.seed(42)
n_samples = 1000

data = {
    "age": np.random.normal(35, 10, n_samples),
    "income": np.random.normal(60000, 20000, n_samples),
    "employment_length": np.random.normal(5, 3, n_samples),
    "debt_to_income": np.random.normal(0.3, 0.1, n_samples),
    "num_credit_lines": np.random.normal(3, 1, n_samples),
    "payment_history": np.random.normal(0.9, 0.1, n_samples),
    "loan_amount": np.random.normal(20000, 10000, n_samples),
    "credit_history": np.random.normal(7, 3, n_samples),
    "employment_duration": np.random.normal(4, 2, n_samples)
}

df = pd.DataFrame(data)

# Generate target variable (credit score)
credit_scores = (
    0.2 * df["payment_history"] * 850 +
    0.2 * (1 - df["debt_to_income"]) * 850 +
    0.15 * df["credit_history"] * 100 +
    0.15 * df["income"] / 100000 * 850 +
    0.1 * df["employment_length"] * 50 +
    0.1 * (1 - df["loan_amount"] / 100000) * 850 +
    0.1 * df["num_credit_lines"] * 100
)
credit_scores = np.clip(credit_scores, 300, 850)

# Train model
X = df
y = credit_scores

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_scaled, y)

# Save model and scaler
joblib.dump(model, "credit_scoring_model.joblib")
joblib.dump(scaler, "feature_scaler.joblib")
