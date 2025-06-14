FROM python:3.12-slim

WORKDIR /app
COPY . .

RUN pip install --upgrade pip && pip install -r requirements.txt
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "shoping.wsgi:application", "--bind", "0.0.0.0:8000"]