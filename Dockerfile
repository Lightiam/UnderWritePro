FROM python:3.12-slim

WORKDIR /app

COPY ./pyproject.toml ./poetry.lock ./
COPY ./src ./src
COPY ./tests ./tests

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-dev

EXPOSE 8000

CMD ["poetry", "run", "python", "-m", "uvicorn", "underwritepro.main:app", "--host", "0.0.0.0", "--port", "8000"]
