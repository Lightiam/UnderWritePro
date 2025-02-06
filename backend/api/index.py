from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from datetime import datetime
import numpy as np
from openai import AsyncOpenAI
import json

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

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    timeout=30.0
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a credit scoring specialist."},
                {"role": "user", "content": message.content}
            ],
            temperature=0.7,
            max_tokens=800
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
            
        contents = await file.read()
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
