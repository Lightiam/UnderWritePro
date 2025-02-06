from openai import AsyncOpenAI
import os

class ChatService:
    def __init__(self):
        self.client = AsyncOpenAI(timeout=30.0)

    async def process_message(self, content: str):
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an AI credit scoring assistant. Provide insights and recommendations about credit scoring, loan applications, and financial analysis."},
                    {"role": "user", "content": content}
                ],
                max_tokens=500
            )
            return {"response": response.choices[0].message.content}
        except Exception as e:
            return {"status": "error", "error": str(e)}
