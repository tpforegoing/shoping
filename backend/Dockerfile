FROM python:3.11-slim

WORKDIR /app
COPY . /app

ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=shoping.settings

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["gunicorn", "shoping.wsgi:application", "--bind", "0.0.0.0:8000"]