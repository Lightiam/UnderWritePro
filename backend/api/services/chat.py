from openai import AsyncOpenAI
from fastapi import HTTPException
import os
from dotenv import load_dotenv

load_dotenv()

class ChatService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = AsyncOpenAI(api_key=api_key)

    async def process_message(self, content: str):
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an AI credit scoring assistant. Provide insights and recommendations about credit scoring, loan applications, and financial analysis."},
                    {"role": "user", "content": content}
                ],
                max_tokens=500,
                temperature=0.7
            )
            return {"response": response.choices[0].message.content}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
