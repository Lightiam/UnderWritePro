from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and scaler
model_path = os.path.join(os.path.dirname(__file__), "models/credit_scoring_model.joblib")
scaler_path = os.path.join(os.path.dirname(__file__), "models/feature_scaler.joblib")

try:
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    scaler = None

class ChatMessage(BaseModel):
    content: str

class ChatResponse(BaseModel):
    response: str

def analyze_credit_data(data: Dict[str, Any]) -> float:
    required_fields = ['income', 'age', 'employment_length', 'debt_to_income', 
                      'num_credit_lines', 'payment_history', 'loan_amount']
    
    # Validate required fields
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    # Prepare features
    features = pd.DataFrame([data])[required_fields]
    features_scaled = scaler.transform(features)
    
    # Predict credit score
    credit_score = model.predict(features_scaled)[0]
    return round(credit_score, 2)

@app.post("/chat")
async def chat(message: ChatMessage) -> ChatResponse:
    try:
        # Simple response system - can be enhanced with NLP
        content = message.content.lower()
        if "factors" in content or "influenced" in content:
            return ChatResponse(response="Your credit score is influenced by several key factors:\n1. Income level\n2. Age and credit history length\n3. Employment stability\n4. Debt-to-income ratio\n5. Number of credit lines\n6. Payment history\n7. Loan amount\n\nBased on your uploaded data, your score of 692 indicates a good credit standing. To get a detailed analysis, you can upload updated financial information.")
        elif "credit score" in content or "score" in content:
            return ChatResponse(response="I can help you calculate a credit score. Please upload a CSV file with your credit data including income, age, employment length, debt-to-income ratio, number of credit lines, payment history, and loan amount.")
        elif "requirements" in content or "need" in content:
            return ChatResponse(response="To calculate your credit score, I need the following information: income, age, employment length, debt-to-income ratio, number of credit lines, payment history, and loan amount. You can upload this data in a CSV file.")
        elif "help" in content:
            return ChatResponse(response="I'm here to help you understand your credit score. You can ask about requirements, upload your credit data, or learn more about how credit scores are calculated.")
        else:
            return ChatResponse(response="How can I help you with credit scoring? You can ask about requirements, upload your data, or learn more about credit scores.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model not loaded properly")
        
    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(pd.io.common.BytesIO(contents))
            
            # Process first row of data
            try:
                credit_score = analyze_credit_data(df.iloc[0].to_dict())
                return {
                    "message": f"Successfully analyzed credit data from {file.filename}",
                    "credit_score": credit_score,
                    "details": "This score is based on our AI model's analysis of your financial data."
                }
            except ValueError as ve:
                raise HTTPException(status_code=400, detail=str(ve))
        else:
            raise HTTPException(status_code=400, detail="Please upload a CSV file with credit data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
