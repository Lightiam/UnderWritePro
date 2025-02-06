import pytest
import httpx
from src.underwritepro.main import app

@pytest.fixture
async def client():
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_chat_endpoint(client):
    response = await client.post("/chat", json={"content": "What is my credit score?"})
    assert response.status_code == 200
    data = response.json()
    assert "response" in data

@pytest.mark.asyncio
async def test_upload_endpoint(client, tmp_path):
    test_csv = tmp_path / "test.csv"
    test_csv.write_text("""age,income,employment_length,debt_to_income,num_credit_lines,payment_history,loan_amount,credit_history,employment_duration
35,75000,10,0.3,3,good,25000,good,5""")
    
    with open(test_csv, "rb") as f:
        files = {"file": (test_csv.name, f, "text/csv")}
        response = await client.post("/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "credit_score" in data
    assert isinstance(data["credit_score"], (int, float))
    assert "details" in data

@pytest.mark.asyncio
async def test_invalid_chat_request(client):
    response = await client.post("/chat", json={})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_invalid_file_upload(client):
    response = await client.post("/upload", files={})
    assert response.status_code == 422
