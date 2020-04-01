from flask import Flask, render_template, request, url_for
from flask_socketio import SocketIO, emit

from master import Master

# Initialize the flask app.
app = Flask(__name__)
socketio = SocketIO(app)
master = Master()

# Serve the index page.
@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')

# Serve the game in solo mode.
@app.route('/solo', methods=['GET'])
def solo():
	return render_template('solo.html')

# Serve the game in duo mode.
@app.route('/duo', methods=['GET'])
def duo():
	return render_template('duo.html')


# A client requests to play in duo mode.
@socketio.on('requestDuoGame')
def requestDuoGame(data):
	return master.requestDuoGame(request.sid)

# A client sends an update of its own arena.
@socketio.on('updateArena')
def updateArena(data):
	return master.updateArena(request.sid, data)

# A client disconnects.
@socketio.on('disconnect')
def disconnect():
	return master.disconnect(request.sid)

# A client requests the next piece (only in duo mode).
@socketio.on('requestNextPiece')
def requestNextPiece(data):
	return master.requestNextPiece(request.sid)

# A client sends its new piece position.
@socketio.on('piece')
def receivePiece(data):
	return master.receivePiece(request.sid, data)

# A player in duo mode wants to toggle the paused state.
@socketio.on('pause')
def pause(data):
	return master.pause(request.sid)

# A player in duo mode has decided to start over.
@socketio.on('startedAgain')
def startedAgain(data):
	return master.startedAgain(request.sid)

# Run the app with web sockets capabilities.
if __name__ == '__main__':
	app.debug = True
	socketio.run(app, host='0.0.0.0', port=8080)
