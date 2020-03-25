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

		/* Create a text message board at the top. */
		this.messageBoard = new TextBox(initialx, initialy, width, height / 10, 'hello', true);

		/* Create a grid on the left panel. */
		let gridHeight = 9 * height / 10;
		this.grid = new Grid(initialx, initialy + height / 10, gridHeight / 2, gridHeight);

		/* Create the message boards on the right panel. */
		let initialxRightPanel = initialx + gridHeight / 2;
		let initialyRightPanel = initialy + height / 10;
		let heightRightPanel = 9 * height / 10;
		let widthRightPanel = width - (heightRightPanel / 2);
		let initialLevelBoardMessage = 'LEVEL: 0';
		this.levelBox = new TextBox(initialxRightPanel, initialyRightPanel, widthRightPanel, heightRightPanel / 8, initialLevelBoardMessage, true);
		let scoreLinesMessage = 'SCORE: 0\nLINES: 0';
		this.scoreLinesBox = new TextBox(initialxRightPanel, initialyRightPanel + heightRightPanel / 8, widthRightPanel, heightRightPanel / 8, scoreLinesMessage, true);
		this.nextPieceBox = new NextPieceBox(initialxRightPanel, initialyRightPanel + heightRightPanel / 4, widthRightPanel, heightRightPanel / 4);
		this.statBox = new StatBox(initialxRightPanel, initialyRightPanel + heightRightPanel / 2, widthRightPanel, heightRightPanel / 2, this.possiblePieces);

		/* Create the current piece and the next piece. */
		this.piece = undefined;
		this.nextPiece = undefined;

		/* Create a stopwatch to keep track of the timing of the animation
    of the falling piece. */
		this.stopwatch = new Stopwatch();

		/* Variables for the logic of the game. */
		this.level = 0;
		this.downKeyPressed = false;
		this.lost = false;
		this.score = 0;
		this.lines = 0;
	}

	/* Update all the elements inside the arena. This function
	gets called in a loop. */
	update() {
		if (this.lost) {
			return;
		}

		/* Create pieces if not defined. */
		if (this.nextPiece == undefined) {
			this.nextPiece = this.createNewPiece();
			this.nextPieceBox.updatePiece(this.nextPiece);
			this.statBox.updateCounts(this.nextPiece.type);
		}
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
		/* If the piece is not able to move down, replace the current piece. */
		if (!this.piece.move(DIR_DOWN, this.grid)) {
			/* The piece was not able to move down, so drop it in the grid. */
			this.grid.receive(this.piece);
			this.piece = undefined;

			/* Assign score in the current grid and clean squares. */
			let result = this.grid.assignScoresAndClean();
			this.score += result['score'];
			this.lines += result['lines'];
			this.updateScoreLinesBoard();

			/* Check if the player has to change level. */
			this.checkLevel();

			/* Check if this player has lost. */
			this.checkLose();
			return false;
		}

		this.stopwatch.start();
		return true;
	}

	/* Replaces the current falling piece with a new one and starts the stopwatch. */
	createNewPiece() {
		return new Piece(this.possiblePieces[Math.floor(Math.random() * this.possiblePieces.length)]);
	}

	/* Handles input from the keyboard. */
	keyPressed(code) {
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

	/* Checks if the player has cleared lines so as to change level. */
	checkLevel() {
		this.level = Math.floor(this.lines / 10);
		this.updateLevelBoard();
	}

	/* Updates the score and lines board with the new values. */
	updateScoreLinesBoard() {
		let message = 'SCORE: ' + this.score + '\nLINES: ' + this.lines;
		this.scoreLinesBox.changeText(message);
	}

	/* Updates the level board after a change in level. */
	updateLevelBoard() {
		this.levelBox.changeText('LEVEL: ' + this.level);
	}

	/* Displays all the elements in the arena. */
	display() {
		super.display();

		/* Display the top message board and the boards on the right panel. */
		this.messageBoard.display();
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
