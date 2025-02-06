from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import pandas as pd
import io
from underwritepro.models.credit_model import CreditScoringModel

class ChatMessage(BaseModel):
    content: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

model = CreditScoringModel()
model_path = os.getenv("MODEL_PATH", "/home/ubuntu/UnderWritePro/backend/src/underwritepro/models/credit_scoring_model.joblib")
scaler_path = os.getenv("SCALER_PATH", "/home/ubuntu/UnderWritePro/backend/src/underwritepro/models/feature_scaler.joblib")
model.load(model_path, scaler_path)

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        content = message.content.lower()
        
        # Default response for general inquiries
        response = ("I can help you analyze credit data and provide credit scoring insights. "
                   "Upload a CSV file with your credit information or ask me specific questions.")

        # Handle different types of credit-related queries
        if "credit score" in content:
            if "calculate" in content or "determine" in content:
                response = ("Credit scores are calculated using multiple factors including:\n"
                          "- Income level and stability\n"
                          "- Employment history\n"
                          "- Debt-to-income ratio\n"
                          "- Payment history\n"
                          "- Number of credit lines\n\n"
                          "Upload your credit data file to get a personalized analysis.")
            else:
                response = ("Credit scores typically range from 300 to 850. A higher score "
                          "indicates better creditworthiness:\n"
                          "- Excellent: 750+\n"
                          "- Good: 670-749\n"
                          "- Fair: 580-669\n"
                          "- Poor: Below 580")
        
        elif "requirements" in content or "format" in content:
            response = ("To analyze your credit data, please provide a CSV file with the following information:\n"
                      "- Age\n"
                      "- Income\n"
                      "- Employment length\n"
                      "- Debt-to-income ratio\n"
                      "- Number of credit lines\n"
                      "- Payment history (poor/fair/good/excellent)\n"
                      "- Loan amount\n"
                      "- Credit history (poor/fair/good/excellent)\n"
                      "- Employment duration")
        
        elif "improve" in content or "better" in content:
            response = ("To improve your credit score, consider these key factors:\n"
                      "1. Make all payments on time\n"
                      "2. Keep credit utilization low (below 30%)\n"
                      "3. Maintain a good mix of credit types\n"
                      "4. Keep old credit accounts open\n"
                      "5. Limit new credit applications\n\n"
                      "Upload your credit data for personalized recommendations.")
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename or not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported"
            )
            
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        required_columns = ['age', 'income', 'employment_length', 'debt_to_income', 
                          'num_credit_lines', 'payment_history', 'loan_amount', 
                          'credit_history', 'employment_duration']
        
        missing_cols = [col for col in required_columns if col not in df.columns]
        if missing_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_cols)}"
            )
            
        first_row = df.iloc[0:1]
        credit_score = model.predict(first_row)
        score_value = float(credit_score)
        
        if score_value >= 750:
            risk_level = "Excellent"
            recommendation = "Highly qualified for premium credit products"
        elif score_value >= 670:
            risk_level = "Good"
            recommendation = "Qualified for most credit products"
        elif score_value >= 580:
            risk_level = "Fair"
            recommendation = "May qualify for standard credit products"
        else:
            risk_level = "Poor"
            recommendation = "Credit improvement recommended before applying"
        
        details = f"""
Credit Risk Level: {risk_level}
Recommendation: {recommendation}

Key Factors:
- Income Level: ${df['income'].iloc[0]:,.2f}
- Debt-to-Income Ratio: {df['debt_to_income'].iloc[0]:.2%}
- Payment History: {df['payment_history'].iloc[0]}
- Credit History: {df['credit_history'].iloc[0]}
"""
        
        return {
            "credit_score": score_value,
            "details": details.strip()
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
