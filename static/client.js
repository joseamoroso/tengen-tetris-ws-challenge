/* Define the directions of movement of the pieces. */
const DIR_DOWN = 'down'
const DIR_RIGHT = 'right'
const DIR_LEFT = 'left'

/* Scoring system (at level zero) */
const POINTS = {
	1: 40,
	2: 100,
	3: 300,
	4: 1200
};

const DEFAULT_TEXT_SIZE = 16;
const DEFAULT_BORDER_STROKE_WEIGHT = 3;

const PIECES = ['T', 'J', 'Z', 'O', 'S', 'L', 'I'];

const MESSAGES = {
	'paused': 'PAUSED',
	'lost': 'GAME OVER'
};

/* This class controls the highest level logic of the game. */
class Client {
	constructor(canvasWidth, canvasHeight, mode) {
		console.log('Creating client object in mode: ' + mode);
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.mode = mode;

		/* Create an active arena for the player and an adversary's arena. */
		this.activeArena = undefined;
		this.adversaryArena = undefined;

		/* Create the text boxes at the top. */
		if (mode == 'solo') {
			this.soloMessageBox = new TextBox(0, 0, canvasWidth, canvasHeight / 10, '', true);
		}
		else if (mode == 'duo') {
			let duoBoxWidth = canvasWidth - 9 * canvasHeight / 10;
			let messageBoxesWidth = (canvasWidth - duoBoxWidth) / 2;
			this.activeMessageBox = new TextBox(0, 0, messageBoxesWidth, canvasHeight / 10, '', true);
			this.adversaryMessageBox = new TextBox(messageBoxesWidth + duoBoxWidth, 0, messageBoxesWidth, canvasHeight / 10, '', true);
			this.duoMessageBox = new TextBox(messageBoxesWidth, 0, duoBoxWidth, canvasHeight / 10, MESSAGES['paused'], true);
		}

		/* Create a next piece generator. */
		this.nextPieceGenerator = new NextPieceGenerator(mode);

		/* High level control of the game. */
		this.paused = mode == 'solo' ? false : true;
		this.lost = false;
	}

	/* Gives a new value for the active arena. */
	initializeActiveArena() {
		if (this.mode == 'solo') {
			this.activeArena = new Arena(0, this.canvasHeight / 10, this.canvasWidth, 9 * this.canvasHeight / 10);
		}
		else if (this.mode == 'duo') {
			this.activeArena = new Arena(0, this.canvasHeight / 10, this.canvasWidth / 2, 9 * this.canvasHeight / 10);
		}
	}

	/* Gives a new value for the adversary arena. */
	initializeAdversaryArena() {
		this.adversaryArena = new Arena(this.canvasWidth / 2, this.canvasHeight / 10, this.canvasWidth / 2, 9 * this.canvasHeight / 10);
	}

	/* In duo mode, begin the game when the server has found two players. */
	beginDuoGame(data) {
		this.initializeActiveArena();
		this.initializeAdversaryArena();
		this.nextPieceGenerator.receiveFirstBatch(data);

		/* Send the first two pieces to both arenas. */
		this.nextPieceGenerator.sendFirstPieces(this.activeArena);
		this.nextPieceGenerator.sendFirstPieces(this.adversaryArena);
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

	/* The server has sent the next batch to the active arena. */
	receiveNextBatch(data) {
		this.nextPieceGenerator.receiveBatch(data);
	}

	/* The server updates the position of the adversary piece. */
	receiveAdversaryPiece(data) {
		this.adversaryArena.receivePiece(data);
	}

	/* Gets called when a key is pressed. */
	keyPressed(code, key) {
		if (key == ' ') {
			if (this.mode == 'solo' && !this.lost || this.mode == 'duo') {
				this.togglePause();
			}

			/* In duo mode, notify the server about the pause event. */
			if (this.mode == 'duo') {
				this.sendMessage('pause', {});
			}
		}
		else if (code == ENTER && this.lost && !this.paused) {
			this.lost = false;
			this.initializeActiveArena();

			/* Change the messages. */
			if (this.mode == 'solo') {
				this.soloMessageBox.changeText('');
			}
			else if (this.mode == 'duo') {
				this.activeMessageBox.changeText('');
			}

			/* In duo mode, send in the first pieces and notify the server. */
			if (this.mode == 'duo') {
				this.nextPieceGenerator.sendFirstPieces(this.activeArena);
				this.sendMessage('startedAgain', {});
			}
		}
		else {
			/* For any other key, send the key to the active arena. */
			if (this.activeArena != undefined && !this.paused && !this.lost) {
				this.activeArena.keyPressed(code, this.mode);
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

	/* The arena notifies the client that this player has lost. */
	playerHasLost() {
		this.lost = true;

		/* Change the message and notify the other client if needed. */
		if (this.mode == 'solo') {
			this.soloMessageBox.changeText(MESSAGES['lost']);
		}
		else if (this.mode == 'duo') {
			this.activeMessageBox.changeText(MESSAGES['lost']);
			this.sendMessage('lost', {});
		}
	}

	/* The server notifies me that the other player has lost. */
	otherPlayerHasLost() {
		this.adversaryMessageBox.changeText(MESSAGES['lost']);
	}

	/* Toggle the paused state (this event can be sent by the server or performed by the player). */
	togglePause() {
		this.paused = this.paused ? false : true;

		/* Change the message. */
		let message = this.paused ? MESSAGES['paused'] : '';
		if (this.mode == 'solo') {
			this.soloMessageBox.changeText(message);
		}
		else if (this.mode == 'duo') {
			this.duoMessageBox.changeText(message);
		}
	}

	/* The adversary has started again. */
	startedAgain() {
		this.initializeAdversaryArena();
		this.nextPieceGenerator.sendFirstPieces(this.adversaryArena);
		this.adversaryMessageBox.changeText('');
	}

	/* The arena asks for the next piece. */
	getNextPiece() {
		return this.nextPieceGenerator.getNextPiece();
	}

	/* Main loop that updates the arenas. */
	update() {
		/* In solo mode, initialize active arena if not defined. */
		if (this.mode == 'solo' && this.activeArena == undefined) {
			this.initializeActiveArena();
		}

		/* Update the active arena if not paused and not lost. */
		if (this.activeArena != undefined && !this.paused && !this.lost) {
			this.activeArena.update(this.mode);
		}

		/* Check the next piece generator is updated. */
		if (this.mode == 'duo' && this.activeArena != undefined) {
			this.nextPieceGenerator.update();
		}
	}

	display() {
		/* Display the arenas if defined. */
		if (this.activeArena != undefined) {
			this.activeArena.display();
		}
		if (this.adversaryArena != undefined) {
			this.adversaryArena.display();
		}

		/* Display the message boxes. */
		if (this.mode == 'solo') {
			this.soloMessageBox.display();
		}
		else if (this.mode == 'duo') {
			this.duoMessageBox.display();
			this.activeMessageBox.display();
			this.adversaryMessageBox.display();
		}
	}
}
