from flask import render_template
from flask_socketio import emit

class Master:
	def __init__(self):
		self.players = {
			1: None,
			2: None
		}

	# A client with a specific socket id wants to play.
	def requestDuoGame(self, socketId):
		print('Client ' + request.sid + ' requests to play duo game')
		if self.alreadyPlayer(socketId):
			return
		elif self.players[1] == None:
			self.players[1] = socketId
			emit('waitingForAnotherPlayer', {})
		elif self.players[2] == None:
			self.players[2] = socketId
			emit('beginDuoGame', {}, broadcast=True)

	# Receives a client's socket id and decides if it is already a player.
	def alreadyPlayer(self, socketId):
		if self.players[1] == socketId or self.players[2] == socketId:
			return True
		else:
			return False
