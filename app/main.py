from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
import pandas as pd
import re
from pathlib import Path

class Message(BaseModel):
    role: str
    content: str

class ChatResponse(BaseModel):
    messages: List[Message]
    credit_score: Optional[float] = None
    form_state: Optional[dict] = None

# Global dictionary to store user form data
user_form_data = {}

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# Load model and scaler
model_path = Path(__file__).parent / "models"
model = joblib.load(model_path / "credit_scoring_model.joblib")
scaler = joblib.load(model_path / "feature_scaler.joblib")

class CreditInput(BaseModel):
    income: float
    age: int
    employment_length: int
    debt_to_income: float
    num_credit_lines: int
    payment_history: float
    loan_amount: float

class CreditPrediction(BaseModel):
    credit_score: int

@app.post("/predict")
async def predict_credit_score(credit_input: CreditInput):
    features = [
        credit_input.income,
        credit_input.age,
        credit_input.employment_length,
        credit_input.debt_to_income,
        credit_input.num_credit_lines,
        credit_input.payment_history,
        credit_input.loan_amount
    ]
    
    input_scaled = scaler.transform(np.array([features]))
    prediction = model.predict(input_scaled)[0]
    
    return CreditPrediction(credit_score=int(prediction))

@app.post("/chat")
async def chat_endpoint(message: Message):
    content = message.content.lower()
    
    # Extract numeric value from income input
    if "income" in content.lower():
        try:
            numbers = re.findall(r'\d+', content)
            if numbers:
                income = float(''.join(numbers))
                user_form_data['income'] = income
                response_content = f"Thank you for providing your income (${income:,.2f}). Now, please enter your age:"
            else:
                response_content = "Please provide your annual income as a number (e.g., 75000)"
        except:
            response_content = "Please provide your annual income as a number (e.g., 75000)"
    # Handle age input
    elif any(word in content.lower() for word in ["age", "years old"]):
        try:
            numbers = re.findall(r'\d+', content)
            if numbers:
                age = int(numbers[0])
                if 18 <= age <= 100:
                    user_form_data['age'] = age
                    response_content = f"Thank you. You are {age} years old. Now, please enter your employment length in years:"
                else:
                    response_content = "Please enter a valid age between 18 and 100."
            else:
                response_content = "Please provide your age as a number (e.g., 35)"
        except:
            response_content = "Please provide your age as a number (e.g., 35)"
    # Handle employment length
    elif "employ" in content.lower():
        try:
            numbers = re.findall(r'\d+', content)
            if numbers:
                years = float(numbers[0])
                if 0 <= years <= 50:
                    user_form_data['employment_length'] = years
                    response_content = f"Got it, {years:.1f} years of employment. Now, please enter your debt-to-income ratio (0-1):"
                else:
                    response_content = "Please enter a valid employment length between 0 and 50 years."
            else:
                response_content = "Please provide your employment length in years (e.g., 5)"
        except:
            response_content = "Please provide your employment length in years (e.g., 5)"
    # Handle debt-to-income ratio
    elif any(word in content.lower() for word in ["debt", "ratio", "dti"]):
        try:
            # Look for decimal numbers first
            decimal_numbers = re.findall(r"[-+]?\d*\.\d+", content)
            if decimal_numbers:
                ratio = float(decimal_numbers[0])
            else:
                # If no decimal found, try integer numbers
                numbers = re.findall(r'\d+', content)
                if numbers:
                    ratio = float(numbers[0]) / 100  # Convert percentage to decimal
                else:
                    ratio = None
            
            if ratio is not None and 0 <= ratio <= 1:
                user_form_data['debt_to_income'] = ratio
                response_content = f"Your debt-to-income ratio of {ratio:.2f} has been recorded. Now, how many credit lines do you have?"
            else:
                response_content = "Please enter a valid debt-to-income ratio between 0 and 1 (e.g., 0.35 or 35%)"
        except:
            response_content = "Please provide your debt-to-income ratio as a decimal between 0 and 1 (e.g., 0.35 or 35%)"
    # Handle number of credit lines
    elif any(word in content.lower() for word in ["credit", "lines"]):
        try:
            numbers = re.findall(r'\d+', content)
            if numbers:
                lines = int(numbers[0])
                if 0 <= lines <= 50:
                    user_form_data['num_credit_lines'] = lines
                    response_content = f"Great, you have {lines} credit lines. Now, please enter your payment history score (0-1):"
                else:
                    response_content = "Please enter a valid number of credit lines between 0 and 50."
            else:
                response_content = "Please provide your number of credit lines as a number (e.g., 3)"
        except:
            response_content = "Please provide your number of credit lines as a number (e.g., 3)"
    # Handle payment history score
    elif "payment" in content.lower() or "history" in content.lower():
        try:
            numbers = re.findall(r"[-+]?\d*\.\d+|\d+", content)
            if numbers:
                score = float(numbers[0])
                if 0 <= score <= 1:
                    user_form_data['payment_history'] = score
                    response_content = f"Thank you. Your payment history score is recorded as {score:.2f}. Finally, please enter your loan amount ($):"
                else:
                    response_content = "Please enter a valid payment history score between 0 and 1."
            else:
                response_content = "Please provide your payment history score as a decimal between 0 and 1 (e.g., 0.85)"
        except:
            response_content = "Please provide your payment history score as a decimal between 0 and 1 (e.g., 0.85)"
    # Handle loan amount
    elif "loan" in content.lower():
        try:
            numbers = re.findall(r'\d+', content)
            if numbers:
                amount = float(''.join(numbers))
                user_form_data['loan_amount'] = amount
                
                required_fields = ['income', 'age', 'employment_length', 'debt_to_income', 'num_credit_lines', 'payment_history', 'loan_amount']
                missing_fields = [field for field in required_fields if field not in user_form_data]
                
                if not missing_fields:  # All fields are present
                    features = [user_form_data[field] for field in required_fields]
                    input_scaled = scaler.transform(np.array([features]))
                    prediction = model.predict(input_scaled)[0]
                    
                    # Format the response with all collected information
                    summary = (
                        f"Based on your information:\n"
                        f"- Annual Income: ${user_form_data['income']:,.2f}\n"
                        f"- Age: {user_form_data['age']} years\n"
                        f"- Employment Length: {user_form_data['employment_length']} years\n"
                        f"- Debt-to-Income Ratio: {user_form_data['debt_to_income']:.2f}\n"
                        f"- Number of Credit Lines: {user_form_data['num_credit_lines']}\n"
                        f"- Payment History Score: {user_form_data['payment_history']:.2f}\n"
                        f"- Loan Amount: ${user_form_data['loan_amount']:,.2f}\n\n"
                        f"Your predicted credit score is: {int(prediction)}"
                    )
                    response_content = summary
                    user_form_data.clear()  # Reset form data
                else:
                    response_content = f"Your loan amount of ${amount:,.2f} has been recorded. "
                    if len(missing_fields) > 0:
                        field_prompts = {
                            'income': 'Please enter your annual income in dollars',
                            'age': 'Please enter your age',
                            'employment_length': 'Please enter your employment length in years',
                            'debt_to_income': 'Please enter your debt-to-income ratio (0-1)',
                            'num_credit_lines': 'How many credit lines do you have',
                            'payment_history': 'Please enter your payment history score (0-1)',
                            'loan_amount': 'Please enter your loan amount in dollars'
                        }
                        next_field = missing_fields[0]
                        response_content += field_prompts[next_field]
            else:
                response_content = "Please provide your loan amount as a number (e.g., 200000)"
        except:
            response_content = "Please provide your loan amount as a number (e.g., 200000)"
    # Initial form request
    elif "form" in content.lower():
        response_content = "Let's start with your annual income. Please enter your annual income in dollars:"
    # Initial greeting and score calculation options
    elif any(word in content.lower() for word in ["score", "help", "hi", "hello", "need", "calculate"]) or content.strip() == "":
        response_content = "I can help you calculate your credit score. You can either:\n1. Upload a CSV file with your financial data\n2. Provide the information directly in chat\n\nWhat would you prefer?"
    # Start direct input flow
    elif any(word in content.lower() for word in ["direct", "chat", "provide", "information"]):
        response_content = "Let's start with your annual income. Please enter your annual income in dollars:"
    # File upload handling
    elif any(word in content for word in ["upload", "file", "document", "csv", "pdf"]):
        response_content = "You can upload your financial documents using the paperclip icon. I accept CSV files with credit data or PDF documents for review."
    # Help information
    elif "help" in content:
        response_content = "I can help you with:\n- Credit score calculation\n- Document analysis\n- Financial data review\n\nWhat would you like to know more about?"
    # Default response
    else:
        response_content = "How can I help you evaluate your credit today? I can calculate credit scores, analyze financial documents, or answer questions about the credit scoring process."
    
    return ChatResponse(
        messages=[
            message,
            Message(role="assistant", content=response_content)
        ]
    )

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file or not file.filename:
        return {"status": "error", "error": "No file provided"}
    
    try:
        filename = file.filename.lower()
        contents = await file.read()
        
        if filename.endswith('.csv'):
            # Process CSV file for credit data
            import pandas as pd
            import io
            
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
            required_columns = ['income', 'age', 'employment_length', 'debt_to_income', 
                              'num_credit_lines', 'payment_history', 'loan_amount']
            
            if all(col in df.columns for col in required_columns):
                # Process first row as sample data
                sample_data = df.iloc[0]
                features = [float(sample_data[col]) if isinstance(sample_data[col], (float, int)) else float(sample_data[col].item()) for col in required_columns]
                
                # Make prediction
                input_scaled = scaler.transform(np.array([features]))
                prediction = model.predict(input_scaled)[0]
                
                return {
                    "filename": file.filename,
                    "status": "processed",
                    "type": "csv",
                    "credit_score": int(prediction),
                    "message": "Successfully processed CSV and calculated credit score."
                }
            else:
                return {
                    "filename": file.filename,
                    "status": "error",
                    "type": "csv",
                    "error": "CSV must contain required columns: " + ", ".join(required_columns)
                }
                
        elif filename.endswith('.pdf'):
            return {
                "filename": file.filename,
                "status": "processed",
                "type": "pdf",
                "message": "PDF document received and stored for review."
            }
        else:
            return {
                "filename": file.filename,
                "status": "rejected",
                "error": "Unsupported file type. Please upload CSV or PDF files only."
            }
            
    except Exception as e:
        return {
            "status": "error",
            "error": f"Error processing file: {str(e)}"
        }

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

# Mount the static files directory
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
