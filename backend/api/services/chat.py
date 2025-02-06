from openai import AsyncOpenAI
from typing import Dict, Any
import os
import logging
import asyncio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = AsyncOpenAI(api_key=api_key, timeout=30.0)
        self.system_prompt = """You are an AI credit scoring specialist with expertise in financial analysis and risk assessment. Your role is to:

1. Credit Score Analysis:
   - Explain FICO score components and calculations
   - Interpret credit reports and scoring factors
   - Provide score improvement strategies
   - Analyze credit utilization impact

2. Risk Assessment:
   - Evaluate debt-to-income ratios
   - Assess payment history patterns
   - Analyze credit mix and new credit
   - Review length of credit history

3. Financial Advisory:
   - Recommend credit building strategies
   - Suggest debt management approaches
   - Explain credit product options
   - Provide risk mitigation techniques

4. Data Analysis:
   - Guide users on required credit information
   - Explain how to interpret credit metrics
   - Highlight key factors in credit decisions
   - Recommend documentation needed"""

    async def process_message(self, content: str) -> Dict[str, Any]:
        try:
            logger.info("Processing chat message")
            
            async with asyncio.timeout(30):
                response = await self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": self.system_prompt},
                        {"role": "user", "content": content}
                    ],
                    temperature=0.7,
                    max_tokens=800
                )
                
                logger.info("Successfully received response from OpenAI")
                return {
                    "response": response.choices[0].message.content,
                    "status": "success"
                }
        except asyncio.TimeoutError:
            logger.error("Request to OpenAI API timed out")
            return {
                "response": "I apologize, but the request took too long to process. Please try again.",
                "status": "error",
                "error": "timeout"
            }
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            return {
                "response": "I encountered an error processing your request. Please try again.",
                "status": "error",
                "error": str(e)
            }
