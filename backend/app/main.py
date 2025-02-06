from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from app.models.credit_model import CreditScoringModel
from app.utils.file_processor import process_credit_file

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = CreditScoringModel()
model.load(
    os.getenv("MODEL_PATH", "app/models/credit_scoring_model.joblib"),
    os.getenv("SCALER_PATH", "app/models/feature_scaler.joblib")
)

class ChatMessage(BaseModel):
    content: str

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        response = "I can help you analyze credit data and make predictions. "
        response += "You can upload a CSV file with credit information or ask questions about credit scoring."
        
        if "credit score" in message.content.lower():
            response = ("Credit scores are calculated based on factors like income, "
                      "employment history, debt-to-income ratio, and payment history. "
                      "Upload your data to get a detailed analysis.")
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported"
            )
            
        content = await file.read()
        result = process_credit_file(content)
        
        if result["status"] == "error":
            raise HTTPException(
                status_code=400,
                detail=result["error"]
            )
            
        prediction = model.predict(result["data"].iloc[0])
        return prediction
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
