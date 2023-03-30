# AI Subtitle Generation Full Stack Application

This repository contains a full stack application that generates subtitles for an uploaded video using artificial intelligence. The frontend is built using React and the backend is built using Flask and Celery with the help of ffmpeg and OpenAI's Openn Source Whisper models.

## Installation

To run this application, you need to have Node.js, Python, and ffmpeg installed on your system. Follow the instructions below to install the necessary dependencies:

### Frontend

- Install dependencies by running the command `npm install`
- Run the React app using the command `npm run dev`

### Backend

- Install ffmpeg on your system. To do so, follow the appropriate instructions based on your operating system:
  - On Ubuntu or Debian: `sudo apt update && sudo apt install ffmpeg`
  - On Arch Linux: `sudo pacman -S ffmpeg`
  - On macOS using Homebrew: `brew install ffmpeg`
  - On Windows using Chocolatey: `choco install ffmpeg`
  - On Windows using Scoop: `scoop install ffmpeg`
- Install the necessary Python dependencies by running the command `pip install -r requirements.txt`
- Run the Flask API using the command `python generate_subs.py`
- Run Celery worker nodes using the following command:
  - On a Windows machine: `python -m celery -A generate_subs.celery worker --pool=solo -l info`
  - On other operating systems: `python -m celery -A generate_subs.celery worker -l info`

### Docker

- Before deploying using docker-compose, make sure to set the environment variables correctly for all the services
- Run the application using Docker using the following command: `docker-compose up --build -d`

## Usage

To use the application, follow the steps below:

1. Upload a video file using the frontend interface
2. Wait for the subtitle generation process to complete
3. View the generated subtitles on the frontend

## Contributing

If you'd like to contribute to this project, please fork the repository and make changes as you'd like. Pull requests are welcome!
