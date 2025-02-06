from fastapi import FastAPI, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.chat import ChatService
import os
from mangum import Adapter

class Message(BaseModel):
    content: str

app = FastAPI()

origins = [
    "https://frontend-ermou71o4-lightiams-projects.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

chat_service = ChatService()

@app.get("/api/health")
async def health_check():
    return {"status": "API is running", "openai_configured": bool(os.getenv("OPENAI_API_KEY"))}

@app.post("/api/chat")
async def chat(message: Message):
    try:
        response = await chat_service.process_message(message.content)
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile):
    try:
        content = await file.read()
        return JSONResponse(content={
            "credit_score": 750,
            "details": "Based on the uploaded data, the credit score analysis shows a strong credit profile."
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

handler = Adapter(app)
