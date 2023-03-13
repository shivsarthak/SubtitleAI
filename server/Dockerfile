FROM python:3.9

WORKDIR /app

RUN apt-get -y update 
RUN apt-get install ffmpeg libsm6 libxext6 -y

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY generate_subs.py generate_subs.py
