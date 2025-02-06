from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import pandas as pd
import io
from dotenv import load_dotenv
from underwritepro.models.credit_model import CreditScoringModel
from underwritepro.services.chat import ChatService

load_dotenv()

class ChatMessage(BaseModel):
    content: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

model = CreditScoringModel()
model_path = os.getenv("MODEL_PATH", "/app/src/underwritepro/models/credit_scoring_model.joblib")
scaler_path = os.getenv("SCALER_PATH", "/app/src/underwritepro/models/feature_scaler.joblib")
model.load(model_path, scaler_path)

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY environment variable is not set")

chat_service = ChatService()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": pd.Timestamp.now().isoformat()}

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        if not message.content:
            raise HTTPException(status_code=400, detail="Message content cannot be empty")
            
        response = await chat_service.process_message(message.content)
        if response.get("status") == "error":
            raise HTTPException(status_code=500, detail=response.get("error", "Unknown error occurred"))
            
        return response
    except HTTPException as he:
        raise he
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
