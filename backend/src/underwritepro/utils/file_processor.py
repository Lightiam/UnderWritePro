import pandas as pd
from typing import Dict, Any
import io

def process_credit_file(file_content: bytes) -> Dict[str, Any]:
    try:
        df = pd.read_csv(io.BytesIO(file_content))
        required_columns = [
            'income', 'age', 'employment_length', 'debt_to_income',
            'num_credit_lines', 'payment_history', 'loan_amount'
        ]
        
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return {
                "error": f"Missing required columns: {', '.join(missing_columns)}",
                "status": "error"
            }
            
        if df.empty:
            return {
                "error": "File contains no data",
                "status": "error"
            }
            
        if (df[required_columns] < 0).any().any():
            return {
                "error": "Negative values found in numeric columns",
                "status": "error"
            }
            
        return {
            "data": df,
            "status": "success"
        }
        
    except Exception as e:
        return {
            "error": f"Error processing file: {str(e)}",
            "status": "error"
        }
