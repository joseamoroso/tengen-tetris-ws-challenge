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

	# A client with a specific socket id wants to play.
	def requestDuoGame(self, socketId):
		print('Client ' + socketId + ' requests to play duo game')
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

	# Create the first two pieces and send a message to begin the game.
	def beginDuoGame(self):
		self.pieceList.append(pieces[floor(random() * len(pieces))])
		self.pieceList.append(pieces[floor(random() * len(pieces))])
		self.piecePosition[1] = 2
		self.piecePosition[2] = 2
		firstPieces = {
			'piece': self.pieceList[0],
			'nextPiece': self.pieceList[1]
		}
		print('Sending begin duo game with initial pieces: ')
		print(self.pieceList)
		emit('beginDuoGame', firstPieces, broadcast=True)

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
			print('Cannot get socket id of player number ' + playerNumber)
			return None

	# Receives a JSON object with new contents for the arena of the player
	# specified by its socket id.
	def updateArena(self, socketId, data):
		# Check that this socket id corresponds to a player.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: the socket id received in update arena does not correspond to a player')
			return

		# Update the corresponding arena.
		self.arenas[player].update(data)
		print('Updated the arena of player ' + player)

		# Update the other player's adversary arena.
		adversary = 2 if player == 1 else 1
		emit('adversaryArenaUpdate', data, room=self.getSocketId(adversary))
		print('Sent an arena update to adversary player ' + adversary)

	# Called when a socket id disconnects. Remove this socket id from the player list.
	def disconnect(self, socketId):
		print('Socket id ' + socketId + ' disconnected')
		if self.isPlayer(socketId):
			self.initializePlayers()
			self.initializeArenas()
			emit('endDuoGame', {}, broadcast=True)
			print('Sent end duo game message')

	def initializePlayers(self):
		self.players[1] = None
		self.players[2] = None

	def initializeArenas(self):
		self.arenas[1] = Arena(1, pieces)
		self.arenas[2] = Arena(2, pieces)

	# A client requests the next piece.
	def requestNextPiece(self, socketId):
		# Check that the socket id is a player.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: cannot send next piece to a socket id that is not a player')
			return

		print('Player ' + str(player) + ' is requesting the next piece')

		# If master already has a piece prepared, send that one and update the counter.
		if self.piecePosition[player] < len(self.pieceList):
			nextPiece = self.pieceList[self.piecePosition[player]]
			emit('nextPiece', {'piece': nextPiece}, room=socketId)
			print('Sent next piece ' + nextPiece + ' to player ' + str(player))
			self.piecePosition[player] += 1

		# If not, append a random piece at the end of master's list first, then send that piece.
		else:
			randomPiece = pieces[floor(random() * len(pieces))]
			self.pieceList.append(randomPiece)
			emit('nextPiece', {'piece': randomPiece}, room=socketId)
			print('Sent next piece ' + randomPiece + ' to player ' + str(player))
			self.piecePosition[player] += 1

		print('Current piece list state:')
		print(pieceList)
