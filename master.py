from flask_socketio import emit
from random import random
from math import floor

from arenaElements import Arena

pieces = ['T', 'J', 'Z', 'O', 'S', 'L', 'I']

class Master:
	def __init__(self):
		# Keep track of the socket ids of each player.
		self.players = {
			1: None,
			2: None
		}

		# Keep track of the arena states of each player.
		self.arenas = {
			1: Arena(1, pieces),
			2: Arena(2, pieces)
		}

		# List of the pieces that will fall for both players.
		self.pieceList = []

		# Number of next pieces each player has requested.
		self.piecePosition = {
			1: 0,
			2: 0
		}

	# Logs an incoming message to the terminal.
	def logMessage(self, message, socketId):
		print('-> {} from {}'.format(message, socketId))

	def initializePlayers(self):
		self.players[1] = None
		self.players[2] = None

	def initializeArenas(self):
		self.arenas[1] = Arena(1, pieces)
		self.arenas[2] = Arena(2, pieces)

	# A client with a specific socket id wants to play.
	def requestDuoGame(self, socketId):
		if self.isPlayer(socketId):
			print('Client is already a player')
			return
		elif self.players[1] == None:
			self.players[1] = socketId
			print('Client ' + socketId + ' is assigned player 1')
			print('Sending waitingForAnotherPlayer')
			emit('waitingForAnotherPlayer', {}, room=socketId)
		elif self.players[2] == None:
			self.players[2] = socketId
			print('Client ' + socketId + ' is assigned player 2')
			self.beginDuoGame()
		else:
			print('The room is currently full')
			emit('roomCurrentlyFull', {}, room=socketId)

	# Create the first pieces and tell both players they can start playing.
	def beginDuoGame(self):
		# Create the first ten pieces in the list and pack them.
		self.pieceList = []
		for i in range(10):
			self.pieceList.append(pieces[floor(random() * len(pieces))])
		firstPieces = {
			'pieces': self.pieceList,
		}

		# Initiate the counter for both players.
		self.piecePosition[1] = 10
		self.piecePosition[2] = 10

		print('Created first ten pieces for duo game: ')
		print(self.pieceList)
		emit('beginDuoGame', firstPieces, broadcast=True)

	# Called when a socket id disconnects. If a player, remove it from players.
	def disconnect(self, socketId):
		if self.isPlayer(socketId):
			self.initializePlayers()
			self.initializeArenas()
			emit('endDuoGame', {}, broadcast=True)
			print('Sent end duo game message to both players')

	def getAdversaryPlayerNumber(self, playerNumber):
		return 1 if playerNumber == 2 else 2

	# Receives a client's socket id and decides if it is already a player.
	def isPlayer(self, socketId):
		if self.players[1] == socketId or self.players[2] == socketId:
			return True
		else:
			return False

	# Returns the player number corresponding to the socket id if the client
	# is a player, else it returns None.
	def getPlayerNumber(self, socketId):
		if self.players[1] == socketId:
			return 1
		elif self.players[2] == socketId:
			return 2
		else:
			return None

	# Receives the player number and returns its socket id.
	def getSocketId(self, playerNumber):
		if playerNumber == 1 or playerNumber == 2:
			return self.players[playerNumber]
		else:
			print('ERROR: cannot get socket id of player number ' + playerNumber)
			return None

	# A player requests the next batch of pieces.
	def requestNextBatch(self, socketId):
		# Check that the socket id is a player.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: cannot send next batch to a socket id that is not a player')
			return

		# If master does not have the next ten pieces ready, create as many as needed.
		if self.piecePosition[player] + 10 > len(self.pieceList):
			for i in range(len(self.pieceList) - 1, self.piecePosition[player] + 10):
				self.pieceList.append(pieces[floor(random() * len(pieces))])

		# Pack the next ten pieces into a JSON.
		nextBatch = {}
		nextBatch['pieces'] = []
		for i in range(10):
			nextBatch['pieces'].append(self.pieceList[self.piecePosition[player] + i])

		# Update the counter of this player.
		self.piecePosition[player] += 10

		# Send the batch to the player that requested it.
		emit('nextBatch', nextBatch, room=socketId)

	# Receives a JSON object with the new contents of a player's arena.
	def updateArena(self, socketId, data):
		# Check that this socket id corresponds to a player.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: the socket id received in update arena does not correspond to a player')
			return

		# Update the corresponding arena.
		self.arenas[player].update(data)
		print('Updated the arena of player ' + str(player))

		# Update the other player's adversary arena.
		adversary = self.getAdversaryPlayerNumber(player)
		emit('adversaryArenaUpdate', data, room=self.getSocketId(adversary))
		print('Sent an arena update to adversary player ' + str(adversary))

	# A player sends the new position of its falling piece.
	def updatePiece(self, socketId, data):
		# Check this socket id is a player.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: cannot receive a piece update from a client that is not a player')
			return

		# Update the piece of the player that has sent the request.
		self.arenas[player].updatePiece(data)

		# Send this update to the other player.
		adversary = self.getAdversaryPlayerNumber(player)
		emit('updateAdversaryPiece', data, room=self.getSocketId(adversary))
		print('Sent new position of adversary piece to player ' + str(adversary))

	# A player wants to toggle the paused state.
	def pause(self, socketId):
		# Check the socket id corresponds to a player.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: cannot handle pause message from client that is not a player')
			return

		# Send this pause event back to the other player.
		adversary = self.getAdversaryPlayerNumber(player)
		emit('pause', {}, room=self.getSocketId(adversary))
		print('Sent pause event to player ' + str(adversary))

	# A player in duo mode has decided to start again.
	def startedAgain(self, socketId):
		# Check the socket id corresponds to a player.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: cannot handle startedAgain message from client that is not a player')
			return

		# Reset the piece position of this player.
		self.piecePosition[player] = 10

		# Send this pause event back to the other player.
		adversary = self.getAdversaryPlayerNumber(player)
		emit('startedAgain', {}, room=self.getSocketId(adversary))
		print('Sent started again event to player ' + str(adversary))
