/* Define the directions of movement of the pieces. */
const DIR_DOWN = 'down';
const DIR_RIGHT = 'right';
const DIR_LEFT = 'left';

/* Scoring system at level zero. */
const POINTS = {
	1: 40,
	2: 100,
	3: 300,
	4: 1200
};

const TEXT_SIZE = 16;
const BORDER_STROKE_WEIGHT = 3;
const TICK_DIAMETER = 10;
const COLOR_WHITE = 255;
const COLOR_GREY = 40;
const COLOR_BLACK = 0;

const TEXT_TRY_AGAIN = 'TRY AGAIN';
const TEXT_SUBMIT_AND_TRY_AGAIN = 'SUBMIT AND TRY AGAIN';
const TEXT_GAME_OVER = 'GAME OVER';
const TEXT_SUBMIT = 'INPUT USERNAME';
const TEXT_PAUSED = 'PAUSED';
const TEXT_LEVEL_SELECTOR_TITLE = 'SELECT LEVEL';

const PIECES = ['T', 'J', 'Z', 'O', 'S', 'L', 'I'];

const STATE_SELECT_LEVEL = 'selectLevel';
const STATE_PLAY = 'play';
const STATE_GAME_OVER = 'gameOver';
const STATE_SUBMIT = 'submit';

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

		/* Create the paused text box in the center. */
		let boxWidth = 100;
		let boxHeight = canvasHeight / 10;
		this.pausedBox = new TextBox((canvasWidth - boxWidth) / 2, (canvasHeight - boxHeight) / 2, boxWidth, boxHeight, TEXT_PAUSED, true, COLOR_GREY);

		/* Create a next piece generator. */
		this.nextPieceGenerator = new NextPieceGenerator(mode);

		/* High level control of the game. */
		this.paused = mode == 'solo' ? false : true;
		this.lost = false;

		/* Keep track of the high score. */
		this.highScore = 0;
	}

	/* Gives a new value for the active arena. */
	initializeActiveArena() {
		if (this.mode == 'solo') {
			this.activeArena = new Arena(0, 0, this.canvasWidth, this.canvasHeight, false);
		}
		else if (this.mode == 'duo') {
			this.activeArena = new Arena(0, 0, this.canvasWidth / 2, this.canvasHeight, false);
		}
	}

	/* Gives a new value for the adversary arena. */
	initializeAdversaryArena() {
		this.adversaryArena = new Arena(this.canvasWidth / 2, 0, this.canvasWidth / 2, this.canvasHeight, true);
	}

	/* In duo mode, begin the game when the server has found two players. */
	beginDuoGame(data) {
		this.initializeActiveArena();
		this.initializeAdversaryArena();
		this.nextPieceGenerator.receiveFirstBatch(data);

		/* Initialize the next piece generator. */
		this.nextPieceGenerator.initialize();

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

	/* The server has sent the next batch of pieces. */
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
		else {
			/* For any other key, send the key to the active arena. */
			if (this.activeArena != undefined && !this.paused) {
				this.activeArena.keyPressed(code, key, this.mode);
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
		this.highScore = this.activeArena.getHighScore();

		if (this.mode == 'duo') {
			this.sendMessage('lost', {'high': this.highScore});
		}
	}

	/* The server notifies me that the other player has lost. */
	adversaryLost(data) {
		this.adversaryArena.setHighScore(data['high']);
	}

	/* Toggle the paused state (this event can be sent by the server or performed by the player). */
	togglePause() {
		this.paused = this.paused ? false : true;
	}

	/* The player in the active arena wants to start again. */
	startAgain() {
		this.lost = false;
		this.initializeActiveArena();
		this.activeArena.setHighScore(this.highScore);

		/* In duo mode, send in the first pieces and notify the server. */
		if (this.mode == 'duo') {
			this.nextPieceGenerator.initialize();
			this.nextPieceGenerator.sendFirstPieces(this.activeArena);
			this.sendMessage('startedAgain', {'high': this.highScore});
		}
	}

	/* The adversary has started again. */
	adversaryStartAgain(data) {
		this.initializeAdversaryArena();
		this.nextPieceGenerator.sendFirstPieces(this.adversaryArena);
		this.adversaryArena.setHighScore(data['high']);
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

		/* Display the pause box if needed. */
		if (this.paused) {
			this.activeArena.blurBackground();
			if (this.mode == 'duo') {
				this.adversaryArena.blurBackground();
			}
			this.pausedBox.display();
		}
	}
}
