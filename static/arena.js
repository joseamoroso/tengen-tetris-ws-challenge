/* Define the directions of movement of the pieces. */
let DIR_DOWN = 'down'
let DIR_RIGHT = 'right'
let DIR_LEFT = 'left'

/* Scoring system (at level zero) */
let POINTS = {
	1: 40,
	2: 100,
	3: 300,
	4: 1200
};

let DEFAULT_TEXT_SIZE = 16;
let DEFAULT_BORDER_STROKE_WEIGHT = 3;

/* The arena handles all the information about one player. */
class Arena extends ElementBox {
	constructor(initialx, initialy, width, height) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, true);

		/* Store the list of possible Tetris pieces. */
		this.possiblePieces = ['T', 'J', 'Z', 'O', 'S', 'L', 'I'];

		/* Create a text message box at the top. */
		this.messageBox = new TextBox(initialx, initialy, width, height / 10, 'hello', true);

		/* Create a grid on the left panel. */
		let gridHeight = 9 * height / 10;
		this.grid = new Grid(initialx, initialy + height / 10, gridHeight / 2, gridHeight);

		/* Calculate the position and dimensions of the information panel. */
		let initialxRightPanel = initialx + gridHeight / 2;
		let initialyRightPanel = initialy + height / 10;
		let heightRightPanel = 9 * height / 10;
		let widthRightPanel = width - (heightRightPanel / 2);

		/* Create the elements inside the information panel. */
		let initialLevelBoxMessage = 'LEVEL: 0';
		this.levelBox = new TextBox(initialxRightPanel, initialyRightPanel, widthRightPanel, heightRightPanel / 8, initialLevelBoxMessage, true);
		let scoreLinesMessage = 'SCORE: 0\nLINES: 0';
		this.scoreLinesBox = new TextBox(initialxRightPanel, initialyRightPanel + heightRightPanel / 8, widthRightPanel, heightRightPanel / 8, scoreLinesMessage, true);
		this.nextPieceBox = new NextPieceBox(initialxRightPanel, initialyRightPanel + heightRightPanel / 4, widthRightPanel, heightRightPanel / 4);
		this.statBox = new StatBox(initialxRightPanel, initialyRightPanel + heightRightPanel / 2, widthRightPanel, heightRightPanel / 2, this.possiblePieces);

		/* Create the current piece and the next piece. */
		this.piece = undefined;
		this.nextPiece = undefined;

		/* Create a stopwatch to time the animation of the falling piece. */
		this.stopwatch = new Stopwatch();

		/* Variables for the logic of the game. */
		this.level = 0;
		this.downKeyPressed = false;
		this.lost = false;
		this.score = 0;
		this.lines = 0;

		/* Variables for communication only happening once. */
		this.nextPieceRequested = false;
	}

	/* Update all the elements inside the arena. This function
	gets called in a loop. */
	update(mode) {
		if (this.lost) {
			return;
		}

		/* When the next piece is undefined. */
		if (this.nextPiece == undefined) {
			/* In solo mode, the next piece is created randomly inside the browser. */
			if (mode == 'solo') {
				this.nextPiece = this.createNewPiece();
				this.nextPieceBox.updatePiece(this.nextPiece);
				this.statBox.updateCounts(this.nextPiece.type);
			}
			/* In duo mode, a request has to be sent to the server. */
			else if (mode == 'duo') {
				if (!this.nextPieceRequested) {
					client.sendMessage('updateArena', this.packServerUpdate());
					client.sendMessage('requestNextPiece', {});
					this.nextPieceRequested = true;
				}
			}
		}

		/* When the piece is not defined, grab it from the next piece. */
		if (this.piece == undefined) {
			this.piece = new Piece(undefined);
			this.piece.getValuesFrom(this.nextPiece);
			this.nextPiece = undefined;
			this.stopwatch.start();
		}

		/* If the down key is pressed, directly try to move the piece. */
		if (this.downKeyPressed) {
			if (this.stopwatch.getElapsedTime() > 25) {
				this.movePieceDown();
			}
		}
		else if (this.stopwatch.getElapsedTime() > 400) {
			this.movePieceDown();
		}
	}

	/* Logic for the piece moving down. */
	movePieceDown() {
		/* TODO: at this point, this piece always exists and is about to change
		position, so send the position to the server. */

		/* If the piece is not able to move down, replace the current piece. */
		if (!this.piece.move(DIR_DOWN, this.grid)) {
			/* The piece was not able to move down, so drop it in the grid. */
			this.grid.receive(this.piece);
			this.piece = undefined;

			/* Assign score in the current grid and clean squares. */
			let result = this.grid.assignScoresAndClean();
			this.score += result['score'];
			this.lines += result['lines'];
			this.updateScoreLinesBox();

			/* Check if the player has to change level. */
			this.checkLevel();

			/* Check if this player has lost. */
			this.checkLose();
			return false;
		}

		/* Restart the stopwatch for a new animation frame. */
		this.stopwatch.start();
		return true;
	}

	/* Returns a new piece created randomly from the list. */
	createNewPiece() {
		return new Piece(this.possiblePieces[Math.floor(Math.random() * this.possiblePieces.length)]);
	}

	/* Handles keys pressed on the keyboard. */
	keyPressed(code) {
		if (this.lost) {
			return;
		}

		if (code == LEFT_ARROW) {
			this.piece.move(DIR_LEFT, this.grid);
		}
		else if (code == RIGHT_ARROW) {
			this.piece.move(DIR_RIGHT, this.grid);
		}
		else if (code == UP_ARROW) {
			this.piece.rotate(this.grid);
		}
		else if (code == DOWN_ARROW) {
			this.downKeyPressed = true;
		}
	}

	/* Handles keys released from the keyboard. */
	keyReleased(code) {
		if (code == DOWN_ARROW) {
			this.downKeyPressed = false;
		}
	}

	/* Checks if this player has lost. */
	checkLose() {
		for (let j = 0; j < 10; j++) {
			if (this.grid.squares[0][j].visible) {
				this.lost = true;
				return true;
			}
		}

		return false;
	}

	/* Checks if the player has cleared enough lines to level up. */
	checkLevel() {
		this.level = Math.floor(this.lines / 10);
		this.updateLevelBox();
	}

	/* Updates the score and lines box with the new values. */
	updateScoreLinesBox() {
		let text = 'SCORE: ' + this.score + '\nLINES: ' + this.lines;
		this.scoreLinesBox.changeText(text);
	}

	/* Updates the level box with the new level. */
	updateLevelBox() {
		this.levelBox.changeText('LEVEL: ' + this.level);
	}

	/* This arena receives the first piece and the first next piece (duo mode). */
	receiveFirstPieces(data) {
		this.nextPiece = new Piece(data['nextPiece']);
		this.nextPieceBox.updatePiece(this.nextPiece);
		this.statBox.updateCounts(this.nextPiece.type);
		this.piece = new Piece(data['piece']);
		this.stopwatch.start();
	}

	/* Packs the arena's information to be sent to the server. */
	packServerUpdate() {
		return {
			'level': this.level,
			'score': this.score,
			'lines': this.lines,
			'grid': this.grid.packServerUpdate(),
			'stats': this.statBox.packServerUpdate(),
		}
	}

	/* The server has sent an update on the adversary's arena. */
	receiveServerUpdate(data) {
		/* Keep a copy of the numerical values. */
		this.level = data['level'];
		this.score = data['score'];
		this.lines = data['lines'];

		/* Upate the text boxes. */
		this.updateLevelBox();
		this.updateScoreLinesBox();

		/* Update the grid and the statistics. */
		this.grid.receiveServerUpdate(data['grid']);
		this.statBox.receiveServerUpdate(data['stats']);
	}

	/* The server has sent this arena the next piece. */
	getNextPiece(data) {
		this.nextPiece = new Piece(data['piece']);
		this.nextPieceBox.updatePiece(this.nextPiece);
		this.statBox.updateCounts(this.nextPiece.type);
		this.nextPieceRequested = false;
	}

	/* Displays all the elements in the arena. */
	display() {
		super.display();

		/* Display the top message box and the boxes on the right panel. */
		this.messageBox.display();
		this.levelBox.display();
		this.scoreLinesBox.display();
		this.nextPieceBox.display();
		this.statBox.display();

		/* Display the falling piece. */
		if (this.piece != undefined) {
			this.piece.display(this.grid.initialx, this.grid.initialy, this.grid.squareSize);
		}

		/* Display the grid. */
		this.grid.display();
	}
}
