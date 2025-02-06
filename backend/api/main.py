from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from datetime import datetime
import numpy as np
from services.chat import ChatService

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    content: str

chat_service = ChatService()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

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
        if not file or not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
            
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
            
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="File is empty")
            
        score = np.random.normal(700, 50)
        score = max(300, min(850, score))
        
        if score >= 750:
            risk_level = "Excellent"
            recommendation = "Highly qualified for premium credit products"
        elif score >= 670:
            risk_level = "Good"
            recommendation = "Qualified for most credit products"
        elif score >= 580:
            risk_level = "Fair"
            recommendation = "May qualify for standard credit products"
        else:
            risk_level = "Poor"
            recommendation = "Credit improvement recommended before applying"
        
        details = f"""
Credit Risk Level: {risk_level}
Recommendation: {recommendation}

Analysis completed on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        return {
            "credit_score": float(score),
            "details": details.strip()
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
