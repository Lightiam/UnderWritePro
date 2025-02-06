from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .services.chat import ChatService
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_service = ChatService()

class Message(BaseModel):
    content: str

@app.post("/api/chat")
async def chat(message: Message):
    try:
        response = await chat_service.process_message(message.content)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile):
    try:
        content = await file.read()
        # For demo, return a mock credit score
        return {
            "credit_score": 750,
            "details": "Based on the uploaded data, the credit score analysis shows a strong credit profile."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
