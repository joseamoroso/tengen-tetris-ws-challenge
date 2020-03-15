let DIR_DOWN = 'down'
let DIR_RIGHT = 'right'
let DIR_LEFT = 'left'

/* This class handles all the information about only one player. */
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
    }

	/* Update all the elements inside the arena. This function
	gets called in a loop. */
	update() {
		/* Create a new piece if needed. */
		if (this.piece == undefined) {
			this.createNewPiece();
		}

		/* Move the piece down if the time elapsed si enough. */
		if (this.stopwatch.getElapsedTime() > 400) {
			if (!this.piece.move(DIR_DOWN, this.grid)) {
				/* The piece was not able to move, and has been dropped. */
				this.createNewPiece();
			}
			this.stopwatch.reset();
			this.stopwatch.start();
		}
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
