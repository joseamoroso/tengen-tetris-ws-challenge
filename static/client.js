/* This class controls the highest level logic of the game. */
class Client {
	constructor(canvasWidth, canvasHeight, mode) {
		console.log('Creating client object in mode: ' + mode);
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.mode = mode;

		/* Create an active arena for the player and adn adversary's arena. */
		this.activeArena = undefined;
		this.adversaryArena = undefined;

		/* High level control of the game. */
		this.paused = true;
		this.lost = false;

		/* Some variables in duo mode. */
		/* TODO: change this to store more pieces at once. */
		this.firstData = undefined;
	}

	/* Gives a new value for the active arena. */
	initializeActiveArena() {
		if (this.mode == 'solo') {
			this.activeArena = new Arena(0, 0, this.canvasWidth, this.canvasHeight);
		}
		else if (this.mode == 'duo') {
			this.activeArena = new Arena(0, 0, this.canvasWidth / 2, this.canvasHeight);
		}
	}

	/* Gives a new value for the adversary arena. */
	initializeAdversaryArena() {
		this.adversaryArena = new Arena(this.canvasWidth / 2, 0, this.canvasWidth / 2, this.canvasHeight);
	}

	/* In duo mode, begin the game only after the server confirms two players have been found. */
	beginDuoGame(data) {
		this.initializeActiveArena();
		this.initializeAdversaryArena();
		this.activeArena.receiveFirstPieces(data);
		this.adversaryArena.receiveFirstPieces(data);
		this.firstData = data;
	}

	/* The server tells the client to end the duo game. */
	endDuoGame() {
		this.activeArena = undefined;
		this.adversaryArena = undefined;
	}

	/* The server has sent an update on the adversary's arena. */
	receiveAdversaryArenaUpdate(data) {
		this.adversaryArena.receiveServerUpdate(data);
	}

	/* The server has sent the next piece for the active arena in duo mode. */
	receiveNextPiece(data) {
		this.activeArena.receiveNextPiece(data);
	}

	/* The server has sent the adversary's next piece. */
	receiveAdversaryNextPiece(data) {
		this.adversaryArena.receiveNextPiece(data);
	}

	/* The server updates the position of the adversary piece. */
	receiveAdversaryPiece(data) {
		this.adversaryArena.receivePiece(data);
	}

	/* Gets called when a key is pressed. */
	keyPressed(code, key) {
		if (key == ' ') {
			if (this.mode == 'solo') {
				if (this.lost) {
					/* Initialize the arena and start playing again. */
					this.initializeActiveArena();
					this.lost = false;
				}
				else {
					/* Just toggle the paused state. */
					this.togglePause();
				}
			}
			else if (this.mode == 'duo') {
				if (this.lost) {
					/* This player wants to start again, so initialize the active arena and send in
					the beginning pieces. */
					this.initializeActiveArena();
					this.activeArena.receiveFirstPieces(this.firstData);
					this.lost = false;

					/* Indicate to the server that the user has started again. */
					this.sendMessage('startedAgain', {});
				}
				else {
					/* Toggle pause and send a pause event to the server. */
					this.togglePause();
					this.sendMessage('pause', {});
				}
			}
		}
		else {
			/* For any other key different from SPACE, send the key to the active arena. */
			if (this.activeArena != undefined && !this.paused && !this.lost) {
				this.activeArena.keyPressed(code);
			}
		}
	}

	/* Gets called when a key is released. */
	keyReleased(code) {
		if (this.activeArena != undefined && !this.paused && !this.lost) {
			this.activeArena.keyReleased(code);
		}
	}

	/* Sends a message, through web sockets, to the server. */
	sendMessage(message, data) {
		console.log('Sending message: ' + message);
		socket.emit(message, data);
	}

	/* The arena notifies the client that the player has lost. */
	playerHasLost() {
		this.lost = true;
	}

	/* Toggle the paused state (this event can be sent by the server or performed by the player). */
	togglePause() {
		this.paused = this.paused ? false : true;
	}

	/* The adversary has started again. */
	startedAgain() {
		this.initializeAdversaryArena();
		this.adversaryArena.receiveFirstPieces(this.firstData);
	}

	/* Main loop that updates the arenas. */
	update() {
		/* In solo mode, if the active arena is not defined, define it. */
		if (this.mode == 'solo' && this.activeArena == undefined) {
			this.initializeActiveArena();
		}

		/* Update the active arena if not paused and not lost. */
		if (this.activeArena != undefined && !this.paused && !this.lost) {
			this.activeArena.update(this.mode);
		}
	}

	/* Display the arenas if defined. */
	display() {
		if (this.activeArena != undefined) {
			this.activeArena.display();
		}
		if (this.adversaryArena != undefined) {
			this.adversaryArena.display();
		}
	}
}
