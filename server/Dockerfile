FROM python:3.9

WORKDIR /app

RUN apt-get -y update 
RUN apt-get install ffmpeg libsm6 libxext6  -y

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
