# AI Subtitle Generation Website

## Run Frontend
### Install Dependencies
```shell
npm install
```
### Run React App
```shell
npm run dev
``` 

## Setup Backend

### Install dependencies
> Install ffmpeg on system
```shell
# on Ubuntu or Debian
sudo apt update && sudo apt install ffmpeg

# on Arch Linux
sudo pacman -S ffmpeg

# on MacOS using Homebrew (https://brew.sh/)
brew install ffmpeg

# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg
```
```shell
cd server
python pip install flask werkzeug openai-whisper celery flask-cors flask-socketio ffmpeg-python
``` 
### Run Flask API
```shell
python generate_subs.py
```
### Run Celery Worker nodes
```shell
# On windows machine
python -m celery -A generate_subs.celery worker --pool=solo -l info
# On Other OS machine
python -m celery -A generate_subs.celery worker -l info
```