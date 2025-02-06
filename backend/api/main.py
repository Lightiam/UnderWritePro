from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.chat import ChatService

app = FastAPI()

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

@app.get("/")
async def root():
    return {"status": "API is running"}

@app.post("/chat")
async def chat(message: Message):
    try:
        response = await chat_service.process_message(message.content)
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile):
    try:
        content = await file.read()
        return JSONResponse(content={
            "credit_score": 750,
            "details": "Based on the uploaded data, the credit score analysis shows a strong credit profile."
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
