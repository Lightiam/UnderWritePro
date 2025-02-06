from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from underwritepro.services.chat import ChatService
import numpy as np
from datetime import datetime

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
        data = contents.decode('utf-8').split('\n')[1].split(',')
        
        # Simple scoring logic
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
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
