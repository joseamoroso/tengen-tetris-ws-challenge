from flask_socketio import emit
from random import random
from math import floor

from arenaElements import Arena
from rooms import Room

roomsNumber = 2

class Master:
	def __init__(self):
		# Create the rooms.
		self.rooms = {}
		for i in range(roomsNumber):
			roomName = 'room{}'.format(i + 1)
			self.rooms[roomName] = Room(roomName)

		# List of the pieces that will fall for both players.
		#self.pieceList = []

		# Number of next pieces each player has requested.
		#self.piecePosition = {
		#	1: 0,
		#	2: 0
		#}

	# Logs an incoming message to the terminal.
	def logMessage(self, message, socketId):
		print('-> {} from {}'.format(message, socketId))

	'''
	def initializePlayers(self):
		self.players[1] = None
		self.players[2] = None

	def initializeArenas(self):
		self.arenas[1] = Arena(1, pieces)
		self.arenas[2] = Arena(2, pieces)'''

	# Bounce a message from one player to the other.
	def bounce(self, socketId, message, data):
		# Check that this client is a player.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: cannot bounce message ' + message)
			return False

		# Send the same message, with the same data, to the socket id of the other player.
		emit(message, data, room=self.getSocketId(self.getAdversaryPlayerNumber(player)))
		return True

	# A client with a specific socket id wants to play.
	def requestDuoGame(self, socketId):
		# Search for an available room.
		availableRoom = None
		for room in rooms.items():
			if room.numPlayers() < 2:
				availableRoom = room
				break

		# If no room is available, notify the client.
		if availableRoom == None:
			print('All rooms are currently full')
			emit('allRoomsFull', {}, room=socketId)
			return

		# Join the client to the available room.
		availableRoom.join(socketId)
		'''
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
			emit('roomCurrentlyFull', {}, room=socketId)'''

	# Returns the room of the socket id, None if not found.
	def getRoom(self, socketId):
		for room in self.rooms.items():
			if room.inRoom(socketId):
				return room
		return None
	'''
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
		emit('beginDuoGame', firstPieces, broadcast=True)'''

	'''
	# Called when a socket id disconnects.
	def disconnect(self, socketId):
		for room in self.rooms.items():
			if room.inRoom(socketId):
				room.disconnect()


		if self.isPlayer(socketId):
			self.initializePlayers()
			self.initializeArenas()
			emit('endDuoGame', {}, broadcast=True)
			print('Sent end duo game message to both players')'''

	'''
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
			return None'''

	'''
	# Receives the player number and returns its socket id.
	def getSocketId(self, playerNumber):
		if playerNumber == 1 or playerNumber == 2:
			return self.players[playerNumber]
		else:
			print('ERROR: cannot get socket id of player number ' + playerNumber)
			return None'''

	# A player requests the next batch of pieces.
	def requestNextBatch(self, socketId):
		# Look for the room of this player.
		room = self.getRoom(socketId)
		if room == None:
			return

		# Request the next batch of the appropriate room.
		room.requestNextBatch(socketId)

		'''
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
		emit('nextBatch', nextBatch, room=socketId)'''

	# Receives a JSON object with the new contents of a player's arena.
	def updateArena(self, socketId, data):
		# Bounce the message to the other player.
		if not self.bounce(socketId, 'updateAdversaryArena', data):
			return

		# Update the corresponding arena.
		self.arenas[self.getPlayerNumber(socketId)].update(data)

	# A player sends the new position of its falling piece.
	def updatePiece(self, socketId, data):
		# Bounce the message to the other player.
		if not self.bounce(socketId, 'updateAdversaryPiece', data):
			return

		# Update the piece of the player that has sent the request.
		self.arenas[self.getPlayerNumber(socketId)].updatePiece(data)

	# A player wants to toggle the paused state.
	def pause(self, socketId):
		# Bounce the message to the other player.
		if not self.bounce(socketId, 'pause', {}):
			return

	# A player has lost and notifies the other one.
	def lost(self, socketId):
		# Bounce the message to the other player.
		if not self.bounce(socketId, 'lost', {}):
			return

	# A player in duo mode has decided to start again.
	def startedAgain(self, socketId):
		# Bounce the message to the other player.
		if not self.bounce(socketId, 'startedAgain', {}):
			return

		# Reset the piece position of this player.
		self.piecePosition[self.getPlayerNumber(socketId)] = 10
