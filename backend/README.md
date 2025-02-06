# UnderWritePro Backend

AI-powered credit scoring platform backend built with FastAPI and scikit-learn.

## Features
- Credit score prediction using machine learning
- File upload processing
- Interactive chat interface
- Secure environment configuration

## Setup
1. Install dependencies: `poetry install`
2. Configure environment variables
3. Run the server: `poetry run uvicorn app.main:app --reload`

## API Endpoints
- POST `/chat`: Process chat messages
- POST `/upload`: Handle file uploads for credit scoring
