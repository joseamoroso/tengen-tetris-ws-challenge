/* Define the directions of movement of the pieces. */
let DIR_DOWN = 'down'
let DIR_RIGHT = 'right'
let DIR_LEFT = 'left'

/* This class handles the information about only one player. */
class Arena {
	constructor(initialx, initialy, width, height) {
		this.initialx = initialx;
		this.initialy = initialy;
		this.width = width;
		this.height = height;

		/* Store the list of possible Tetris pieces. */
		this.possiblePieces = ['T', 'J', 'Z', 'O', 'S', 'L', 'I'];

		/* Create a message board at the top. */
		this.messageBoard = new MessageBoard(initialx, initialy, width, height / 10);

		/* Create the grid itself in the space remaining, at the bottom of that space. */
		let gridHeight = 8 * this.height / 10;
		let gridWidth = gridHeight / 2;
		let gridInitialx = this.initialx + (this.width - gridWidth) / 2;
		let gridInitialy = this.initialy + 2 * this.height / 10;
		this.grid = new Grid(gridInitialx, gridInitialy, gridWidth, gridHeight);

		/* Create the current piece, the one falling right now. */
		this.piece = undefined;

		/* Create a stopwatch to keep track of the timing of the animation
    of the falling piece. */
		this.stopwatch = new Stopwatch();
		this.stopwatch.start();

		/* Variable that remembers if the down key is pressed. */
		this.downKeyPressed = false;

		/* Variable that remembers if the player has lost. */
		this.lost = false;
	}

	/* Update all the elements inside the arena. This function
	gets called in a loop. */
	update() {
		if (this.lost) {
			return;
		}

		/* Create a new piece if needed. */
		if (this.piece == undefined) {
			this.createNewPiece();
		}

		/* If the down key is pressed, directly try to move the piece. */
		if (this.downKeyPressed) {
			if (this.stopwatch.getElapsedTime() > 25) {
				this.movePieceDown();
				this.stopwatch.reset();
				this.stopwatch.start();
			}
		}
		else if (this.stopwatch.getElapsedTime() > 400) {
			this.movePieceDown();
			this.stopwatch.reset();
			this.stopwatch.start();
		}
	}

	/* Logic for the piece moving down. */
	movePieceDown() {
		/* If the piece is not able to move down, replace the current piece. */
		if (!this.piece.move(DIR_DOWN, this.grid)) {
			/* The piece was not able to move down, so drop it in the grid. */
			this.grid.receive(this.piece);
			this.createNewPiece();

			/* Assign score in the current grid and clean squares. */
			this.grid.assignScoresAndClean();

			/* Check if this player has lost. */
			this.checkLose();
			this.grid.assignScoresAndClean();
			return false;
		}

		return true;
	}

	/* Replaces the current falling piece with a new one. */
	createNewPiece() {
		this.piece = new Piece(this.possiblePieces[Math.floor(Math.random() * this.possiblePieces.length)]);
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

	/* Displays all the elements in the arena. */
	display() {
		/* Display a white border around the arena. */
		stroke(255);
		line(this.initialx, this.initialy, this.initialx + this.width, this.initialy);
		line(this.initialx + this.width, this.initialy, this.initialx + this.width, this.initialy + this.height);
		line(this.initialx + this.width, this.initialy + this.height, this.initialx, this.initialy + this.height);
		line(this.initialx, this.initialy + this.height, this.initialx, this.initialy);

		/* Display the message board. */
		this.messageBoard.display();

		/* Display the grid. */
		this.grid.display();

		/* Display the falling piece. */
		if (this.piece != undefined) {
			this.piece.display(this.grid.initialx, this.grid.initialy, this.grid.squareSize);
		}
	}
}
