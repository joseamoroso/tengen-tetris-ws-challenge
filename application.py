from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

# Initialize the flask application
app = Flask(__name__)

# Initialize socketio
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('newconnection')
def playerWaiting(data):
    print('We have a new connection from: ' + str(data['id']))
    emit('ack', data='i have acknowledged you', broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
