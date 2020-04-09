/* The arena handles all the information about one player. */
class Arena extends ElementBox {
	constructor(initialx, initialy, width, height, mirror) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, true);

		/* Decide dimensions and initial positions. */
		let widthPanel = width - height / 2;
		let initialxGrid, initialxPanel;
		if (!mirror) {
			initialxGrid = initialx;
			initialxPanel = initialx + height / 2;
		}
		else {
			initialxPanel = initialx;
			initialxGrid = initialx + widthPanel;
		}

		/* Create the grid. */
		this.grid = new Grid(initialxGrid, initialy, height / 2, height);

		/* Create the elements of the panel. */
		let initialScoreBoxMessage = 'SCORE: 0\nHIGH: 0';
		this.scoreBox = new TextBox(initialxPanel, initialy, widthPanel, height / 8, initialScoreBoxMessage, true);
		let initialLevelLinesBoxMessage = 'LEVEL: 0\nLINES: 0';
		this.levelLinesBox = new TextBox(initialxPanel, initialy + height / 8, widthPanel, height / 8, initialLevelLinesBoxMessage, true);
		this.nextPieceBox = new NextPieceBox(initialxPanel, initialy + height / 4, widthPanel, height / 4);
		this.statBox = new StatBox(initialxPanel, initialy + height / 2, widthPanel, height / 2);

		/* Create the current piece and the next piece. */
		this.piece = undefined;
		this.nextPiece = undefined;

		/* Create a stopwatch to time the animation of the falling piece. */
		this.stopwatch = new Stopwatch();

		/* Variables for the logic of the game. */
		this.level = 0;
		this.high = 0;
		this.score = 0;
		this.lines = 0;
		this.downKeyPressed = false;
	}

	/* Update the elements in the arena. Function called in a loop. */
	update(mode) {
		/* When the next piece is undefined, grab it from the next piece generator. */
		if (this.nextPiece == undefined) {
			this.nextPiece = client.getNextPiece();
			this.nextPieceBox.updatePiece(this.nextPiece);

			/* Only in duo mode, send an update of the current arena. */
			if (mode == 'duo') {
				client.sendMessage('updateArena', this.packServerUpdate());
			}
		}

		/* When the piece is not defined, grab it from the next piece. */
		if (this.piece == undefined) {
			this.piece = new Piece(undefined);
			this.piece.getValuesFrom(this.nextPiece);
			this.statBox.updateCounts(this.piece.type);
			this.nextPiece = undefined;
			this.stopwatch.start();
		}

		/* If the down key is pressed, directly try to move the piece. */
		if (this.downKeyPressed) {
			if (this.stopwatch.getElapsedTime() > 25) {
				if (this.movePieceDown() && mode == 'duo') {
					client.sendMessage('updatePiece', this.packPiece());
				}
			}
		}
		else if (this.stopwatch.getElapsedTime() > 400) {
			if (this.movePieceDown() && mode == 'duo') {
				client.sendMessage('updatePiece', this.packPiece());
			}
		}
	}

	/* Logic for the piece moving down. */
	movePieceDown() {
		/* If the piece is not able to move down, replace the current piece. */
		if (!this.piece.move(DIR_DOWN, this.grid)) {
			/* The piece was not able to move down, so drop it in the grid. */
			this.grid.receive(this.piece);
			this.piece = undefined;

			/* Get the score of the current drop to the grid. */
			let result = this.grid.assignScoresAndClean();
			this.score += result['score'];
			this.lines += result['lines'];
			this.checkLevel();

			/* Update the necessary boxes. */
			this.updateLevelLinesBox();
			this.updateScoreBox();

			/* Check if this player has lost. */
			this.checkLose();
			return false;
		}

		/* Restart the stopwatch for a new animation frame. */
		this.stopwatch.start();
		return true;
	}

	/* Handles keys pressed on the keyboard. */
	keyPressed(code, mode) {
		if (code == LEFT_ARROW) {
			if (this.piece.move(DIR_LEFT, this.grid) && mode == 'duo') {
				client.sendMessage('updatePiece', this.packPiece());
			}
		}
		else if (code == RIGHT_ARROW) {
			if (this.piece.move(DIR_RIGHT, this.grid) && mode == 'duo') {
				client.sendMessage('updatePiece', this.packPiece());
			}
		}
		else if (code == UP_ARROW) {
			if (this.piece.rotate(this.grid) && mode == 'duo') {
				client.sendMessage('updatePiece', this.packPiece());
			}
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

	/* Checks if the player has lost and notifies the client. */
	checkLose() {
		for (let j = 0; j < 10; j++) {
			if (this.grid.squares[0][j].visible) {
				/* Update the high score if needed. */
				if (this.score > this.high) {
					this.high = this.score;
					this.updateScoreBox();
				}

				client.playerHasLost();
				return true;
			}
		}

		return false;
	}

	/* Checks if the player has cleared enough lines to level up. */
	checkLevel() {
		this.level = Math.floor(this.lines / 10);
	}

	/* Updates the text inside the level lines box. */
	updateLevelLinesBox() {
		this.levelLinesBox.changeText('LEVEL: ' + this.level + '\nLINES: ' + this.lines);
	}

	/* Updates the text inside the score box. */
	updateScoreBox() {
		this.scoreBox.changeText('SCORE: ' + this.score + '\nHIGH: ' + this.high);
	}

	/* Returns the current high score. */
	getHighScore() {
		return this.high;
	}

	/* Sets the high score. */
	setHighScore(high) {
		this.high = high;
		this.updateScoreBox();
	}

	/* This arena receives the first two pieces. */
	receiveFirstPieces(data) {
		this.nextPiece = new Piece(data['nextPiece']);
		this.nextPieceBox.updatePiece(this.nextPiece);
		this.piece = new Piece(data['piece']);
		this.statBox.updateCounts(this.piece.type);
		this.stopwatch.start();
	}

	/* Packs the arena's information to be sent to the server. */
	packServerUpdate() {
		return {
			'score': this.score,
			'high': this.high,
			'level': this.level,
			'lines': this.lines,
			'grid': this.grid.packServerUpdate(),
			'stats': this.statBox.packServerUpdate(),
			'piece': this.piece.packServerUpdate(),
			'nextPiece': this.nextPiece.type
		}
	}

	/* The server has sent an update on the adversary's arena. */
	receiveServerUpdate(data) {
		/* Keep a copy of the numerical values. */
		this.score = data['score'];
		this.high = data['high'];
		this.level = data['level'];
		this.lines = data['lines'];

		/* Upate the text boxes. */
		this.updateLevelLinesBox();
		this.updateScoreBox();

		/* Update the grid and the statistics. */
		this.grid.receiveServerUpdate(data['grid']);
		this.statBox.receiveServerUpdate(data['stats']);

		/* Update the piece and the next piece. */
		this.piece.receiveServerUpdate(data['piece']);
		this.nextPiece = new Piece(data['nextPiece']);
		this.nextPieceBox.updatePiece(this.nextPiece);
	}

	/* Packs the falling piece for the server. */
	packPiece() {
		return this.piece.packServerUpdate();
	}

	/* Receives a piece update from the server. */
	receivePiece(data) {
		this.piece.receiveServerUpdate(data);
	}

	/* Displays all the elements in the arena. */
	display() {
		super.display();

		/* Display the boxes on the right panel. */
		this.scoreBox.display();
		this.levelLinesBox.display();
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
