from flask import Flask, request, jsonify, abort, send_file
from werkzeug.utils import secure_filename
import os
import whisper
from datetime import datetime
from celery import Celery
from celery.result import AsyncResult
from flask_cors import CORS
import os
import hashlib
from celery.signals import task_postrun
from flask_socketio import SocketIO


app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 75
app.config['UPLOAD_EXTENSIONS'] = ['mp4', 'avi', 'mov']
app.config['PROCESSING_MODE'] = ['fast', 'balanced', 'accurate']
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER',os.path.abspath('./tmp/uploads/'))
app.config['OUTPUT_FOLDER'] = os.environ.get('OUTPUT_FOLDER',os.path.abspath('./tmp/output/'))
app.config['CELERY_BROKER_URL'] = os.environ.get('CELERY_BROKER_URL','redis://192.168.0.191:6379')
app.config['CELERY_BACKEND_URL'] = os.environ.get('CELERY_BACKEND_URL','redis://192.168.0.191:6379')

if os.environ.get('BUILD_MODE','DEV') == "PROD":
    app.config['HASH_SALT'] = os.urandom(8).hex()
else:
    app.config['HASH_SALT'] = b'testingsalt'.hex()

socketio = SocketIO(app, cors_allowed_origins="*")
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'], backend=app.config['CELERY_BACKEND_URL'])
celery.conf.update(app.config)
celery.conf.update(result_extended=True)


def hash_id(id: str):
    return hashlib.md5((id+app.config['HASH_SALT']).encode('utf-8')).hexdigest()[0:8]

@celery.task(trail=True, bind=True)
def generate_subtitles_task(self, video_name, model_size):
    print(self.request.id)
    model = whisper.load_model(model_size)
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_name)
    audio = whisper.load_audio(video_path)
    try:
        transcript = model.transcribe(audio)
        captions = []
        for segment in transcript['segments']:
            captions.append(
                {'start': int(segment['start']*1000),
                 'end': int(segment['end']*1000),
                 'text': segment['text']
                 }
            )
        subtitle_file = ''
        for i, caption in enumerate(captions, start=1):
            subtitle_file += str(i)+'\n'
            subtitle_file += '{:02d}:{:02d}:{:02d},{:03d} --> {:02d}:{:02d}:{:02d},{:03d}\n'.format(
                caption['start'] // 3600000,
                (caption['start'] // 60000) % 60,
                (caption['start'] // 1000) % 60,
                caption['start'] % 1000,
                caption['end'] // 3600000,
                (caption['end'] // 60000) % 60,
                (caption['end'] // 1000) % 60,
                caption['end'] % 1000
            )
            subtitle_file += caption['text']+'\n\n'
            srt_file_path = os.path.join(
                app.config['OUTPUT_FOLDER'], video_name.split('.')[0]+'.srt')
        with open(srt_file_path, 'w') as file:
            file.write(subtitle_file)

        return video_name.split('.')[0]+'.srt'
    except Exception as e:
        abort(500, 'Error processing the video file: {}'.format(str(e)))

@task_postrun.connect(weak=False)
def task_postrun_handler(sender=None, task_id=None, **kwargs):
    socketio.emit(task_id, {'msg':'ok'},namespace='/api/events')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in app.config['UPLOAD_EXTENSIONS']


@app.route('/api')
def post_run():
    return jsonify({'status':'Running'}),200


@app.route('/api/upload_video', methods=['POST'])
def upload_video():
    if ('video' not in request.files) or ('mode' not in request.form):
        print('no video')
        abort(400, 'No video file or mode found')
    if request.form['mode'] not in app.config['PROCESSING_MODE']:
        print('wrong mode')
        abort(400, 'Wrong Mode specified')
    video_file = request.files['video']
    process_mode = request.form['mode']
    if video_file.filename == '':
        print(video_file.filename)
        abort(400, 'Invalid filename')
    if not allowed_file(video_file.filename):
        print(video_file.filename)
        print('filename not allowed')
        abort(400, 'Invalid file extension')
    if request.content_length > app.config['MAX_CONTENT_LENGTH']:
        print('Size exceeded')
        abort(400, 'File size exceeds the limit')

    video_filename = datetime.now().strftime("%Y%m%d%H%M%S") + \
        secure_filename(video_file.filename)
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)
    video_file.save(video_path)
    model_size = "small"
    if process_mode == 'fast':
        model_size = "tiny"
    if process_mode == 'balanced':
        model_size = "small"
    if process_mode == 'accurate':
        model_size = "medium"
    task = generate_subtitles_task.delay(video_filename, model_size)
    taskid = task.id
    payload = str(taskid)+'+'+hash_id(str(taskid))
    return jsonify({'id': payload}), 200


@app.route('/api/task/<tid>')
def task_status(tid: str):
    if (tid.split('+').__len__() != 2):
        return jsonify(
            {'state': "404",
                'error': f'task id: {tid} not found'
             }
        ), 404
    id, hash = tid.split('+')
    calculated_hash = hash_id(id)
    if (hash != calculated_hash):
        return jsonify(
            {'state': "404",
                'error': f'task id: {tid} not found'
             }
        ), 404
    status = AsyncResult(app=celery, id=id)
    res = {
        'state': status.state,
    }
    return jsonify(res), 200


@app.route('/api/download/<tid>')
def download_file(tid: str):
    if (tid.split('+').__len__() != 2):
        return jsonify(
            {'state': "404",
             'error': f'task id: {tid} not found'
             }
        ), 404
    id, hash = tid.split('+')
    calculated_hash = hash_id(id)
    if (hash != calculated_hash):
        return jsonify(
            {'state': "404",
             'error': f'task id: {tid} not found'
             }
        ), 404
    status = AsyncResult(app=celery, id=id)
    if (status.successful()):
        filename = os.path.join(app.config['OUTPUT_FOLDER'], status.result)
        if os.path.isfile(filename):
            return send_file(filename,as_attachment=True), 200
    return jsonify(
        {'state': "404",
            'error': f'File Not Found'
         }
    ), 404


