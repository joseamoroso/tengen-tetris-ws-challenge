class Client {
	constructor(canvasWidth, canvasHeight, mode) {
		console.log('Creating client object in mode: ' + mode);
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.mode = mode;

		/* Create an active arena and optionally an adversary arena. */
		this.activeArena = undefined;
		this.adversaryArena = undefined;
	}

	initializeActiveArena() {
		if (this.mode == 'solo') {
			this.activeArena = new Arena(0, 0, this.canvasWidth, this.canvasHeight);
		}
		else if (this.mode == 'duo') {
			this.activeArena = new Arena(0, 0, this.canvasWidth / 2, this.canvasHeight);
		}
	}

	initializeAdversaryArena() {
		this.adversaryArena = new Arena(this.canvasWidth / 2, 0, this.canvasWidth / 2, this.canvasHeight);
	}

	/* The server says everything is ready to start a new duo game. */
	beginDuoGame(data) {
		this.initializeActiveArena();
		this.initializeAdversaryArena();
		this.activeArena.receiveFirstPieces(data);
		this.adversaryArena.receiveFirstPieces(data);
		this.playingDuo = true;
	}

	/* The server has sent the update on the adversary's arena. */
	getAdversaryArenaUpdate(data) {
		this.adversaryArena.receiveServerUpdate(data);
	}

	/* The server has sent the next piece for the active arena in duo mode. */
	getNextPiece(data) {
		this.activeArena.getNextPiece(data);
	}

	/* Gets called when a key is pressed. */
	keyPressed(code) {
		if (this.activeArena != undefined) {
			this.activeArena.keyPressed(code);
		}
	}

	/* Gets called when a key is released. */
	keyReleased(code) {
		if (this.activeArena != undefined) {
			this.activeArena.keyReleased(code);
		}
	}

	/* Sends a message, through web sockets, to the server. */
	sendMessage(message, data) {
		console.log('Sending message: ' + message);
		socket.emit(message, data);
	}

	/* Main loop that updates the arenas. */
	update() {
		/* In solo mode, if the active arena is not defined, define it. */
		if (this.mode == 'solo' && this.activeArena == undefined) {
			this.initializeActiveArena();
		}

		/* If in duo mode, create both arenas only in the case that the game has already started. */
		else if (this.mode == 'duo' && this.playingDuo == true) {
			if (this.activeArena == undefined) {
				this.initializeActiveArena();
			}
			if (this.adversaryArena == undefined) {
				this.initializeAdversaryArena();
			}
		}

		/* Update only the active arena, and send in the mode so that the arena itself
		can decide if it has to send updates to the server. */
		if (this.activeArena != undefined) {
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
