from openai import AsyncOpenAI
from typing import Dict, Any
import os
import logging
import asyncio
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        self.client = AsyncOpenAI(timeout=30.0)  # Uses OPENAI_API_KEY from environment automatically
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
   - Recommend documentation needed

Remember to:
- Provide specific, actionable advice
- Use clear, professional language
- Explain complex concepts simply
- Remind users about the file upload feature for personalized analysis
- Focus on practical, implementable solutions"""

    async def process_message(self, content: str) -> Dict[str, Any]:
        try:
            logger.info("Processing chat message")
            enhanced_prompt = self._enhance_prompt(content)
            
            async with asyncio.timeout(30):
                response = await self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": self.system_prompt},
                        {"role": "user", "content": enhanced_prompt}
                    ],
                    temperature=0.7,
                    max_tokens=800,
                    presence_penalty=0.6,
                    frequency_penalty=0.3
                )
                
                logger.info("Successfully received response from OpenAI")
                return {
                    "response": response.choices[0].message.content,
                    "status": "success"
                }
        except asyncio.TimeoutError:
            logger.error("Request to OpenAI API timed out")
            return {
                "response": "I apologize, but the request took too long to process. Please try again with a shorter message or break your question into smaller parts.",
                "status": "error",
                "error": "timeout"
            }
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            return {
                "response": "I encountered an error processing your request. Please ensure your question is related to credit scoring and try again.",
                "status": "error",
                "error": str(e)
            }
            
    def _enhance_prompt(self, content: str) -> str:
        content_lower = content.lower()
        
        if "credit score" in content_lower:
            if any(word in content_lower for word in ["calculate", "determine", "what is", "how to"]):
                return f"{content}\n\nPlease include in your response:\n- Main factors affecting credit scores\n- Score ranges and their implications\n- Specific steps for improvement\n- Impact of different financial behaviors"
        
        if any(word in content_lower for word in ["risk", "assessment", "evaluate"]):
            return f"{content}\n\nPlease cover:\n- Key risk factors\n- Common assessment metrics\n- Risk mitigation strategies\n- Industry benchmarks"
        
        if any(word in content_lower for word in ["improve", "increase", "better"]):
            return f"{content}\n\nPlease provide:\n- Immediate improvement actions\n- Long-term strategies\n- Common mistakes to avoid\n- Timeline expectations"
        
        if any(word in content_lower for word in ["file", "upload", "data", "csv"]):
            return f"{content}\n\nPlease explain:\n- Required data fields\n- Data format requirements\n- How the analysis works\n- What insights will be provided"
        
        return f"{content}\n\nPlease provide detailed, practical advice with specific examples where applicable. Include both immediate actions and long-term strategies when relevant."
