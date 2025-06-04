FROM python:3.12-slim

WORKDIR /app
COPY . .

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["gunicorn", "shoping.wsgi:application", "--bind", "0.0.0.0:8000"]