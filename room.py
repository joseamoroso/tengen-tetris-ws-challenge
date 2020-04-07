from random import random
from math import floor

pieces = ['T', 'J', 'Z', 'O', 'S', 'L', 'I']

class Room:
	def __init__(self, name):
		self.name = name
		self.ids = {
			1: None,
			2: None
		}

		# List of pieces that will be visible to both players.
		self.pieces = []

		# Current position of pieces to give to each player.
		self.position = {
			1: 0,
			2: 0
		}

	def join(self, socketId):
		if self.ids[1] == None:
			self.ids[1] = socketId
			player = 1
		elif self.ids[2] == None:
			self.ids[2] = socketId
			player = 2

		# Join this socket id to the web sockets room.
		join_room(self.name)

		# If the room is not full, tell the player to wait for another one.
		if player == 1:
			emit('waitingForAnotherPlayer', {}, room=socketId)

		# If the room is full, notify both clients and start the game.
		if player == 2:
			self.beginDuoGame()

	# Returns the number of players currently in the room.
	def numPlayers(self):
		if self.ids[1] == None:
			return 0
		elif self.ids[2] == None:
			return 1
		else:
			return 2

	# Returns the player number of a socket id.
	def getPlayerNumber(self, socketId):
		if self.ids[1] == socketId:
			return 1
		elif self.ids[2] == socketId:
			return 2
		else:
			return None

	# Decides if the socket id is a player in this room.
	def inRoom(self, socketId):
		return self.ids[1] == socketId or self.ids[2] == socketId:

	# Starts the duo game.
	def beginDuoGame(self):
		# Create the first ten pieces and pack them.
		self.pieces = []
		for i in range(10):
			self.pieces.append(pieces[floor(random() * len(pieces))])
		firstPieces = {
			'pieces': self.pieces,
		}

		# Initiate the counter for both players.
		self.position[1] = 10
		self.position[2] = 10

		emit('beginDuoGame', firstPieces, room=self.name)

	# A player in this room has disconnected.
	def disconnect(self):
		# Remove both socket ids.
		self.ids[1] = None
		self.ids[2] = None

		# Notify both players.
		emit('endDuoGame', {}, room=self.name)

		# Empty the web sockets room.
		leave_room(self.name)

		print('Disconnected both players in room ' + self.name)

	# Handles the request of a next batch from a socket id of this room.
	def requestNextBatch(self, socketId):
		# Get the player number of this socket id.
		player = self.getPlayerNumber(socketId)
		if player == None:
			return

		# If I do not have the ten next pieces ready, create as many as needed.
		if self.position[player] + 10 > len(self.pieces):
			for i in range(len(self.pieces) - 1, self.position[player] + 10):
				self.pieces.append(pieces[floor(random() * len(pieces))])

		# Pack the next ten pieces into a JSON.
		nextBatch = {}
		nextBatch['pieces'] = []
		for i in range(10):
			nextBatch['pieces'].append(self.pieces[self.position[player] + i])

		# Update the counter of this player.
		self.position[player] += 10

		# Send the batch to the player that requested it.
		emit('nextBatch', nextBatch, room=socketId)
