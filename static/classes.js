let DIR_DOWN = 'down'
let DIR_RIGHT = 'right'
let DIR_LEFT = 'left'

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

		/* Create the grid itself in the space remaining. */
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
			this.piece = new Piece(this.possiblePieces[Math.floor(Math.random() * this.possiblePieces.length)]);
		}

		/* Move the piece down if the time elapsed si enough. */
		if (this.stopwatch.getElapsedTime() > 400) {
			this.piece.move(this.grid);
			this.stopwatch.reset();
			this.stopwatch.start();
		}
	}

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
			this.piece.display(this.grid);
		}
    }
}

class MessageBoard {
    constructor(initialx, initialy, width, height) {
        this.initialx = initialx;
        this.initialy = initialy;
        this.width = width;
        this.height = height;

        /* Calculate coordinates of the center of the board. */
        this.centerx = this.initialx + this.width / 2;
        this.centery = this.initialy + this.height / 2;

        /* A message board has a message that it can display. */
        this.message = 'Hello';
    }

    /* Receives a new message and replaces the current one. */
    changeMessage(message) {
        this.message = message;
    }

    /* Displays the message board to the screen. */
    display() {
        fill(255);
		textAlign(CENTER);
        text(this.message, this.centerx, this.centery);
    }
}

/* This is the main grid for Tetris, where the pieces are stored. */
class Grid {
	constructor(initialx, initialy, width, height) {
		/* Store these values for later use. */
		this.initialx = initialx;
		this.initialy = initialy;
		this.width = width;
		this.height = height;

		/* Calculate the size of one square in pixels. */
		this.squareSize = this.width / 10;

		/* Create a double array to store the squares. */
		this.squares = [20];
		for (let i = 0; i < 20; i++) {
			this.squares[i] = [];
			for (let j = 0; j < 10; j++) {
				this.squares[i].push(new Square(i, j, false));
			}
		}
	}

	/* Display all the squares inside the grid. */
	display () {
		for (let i = 0; i < this.squares.length; i++) {
			for (let j = 0; j < this.squares[i].length; j++) {
				this.squares[i][j].display(this.initialx, this.initialy, this.squareSize);
			}
		}
	}
}

/* This is a set of four squares with a center square that represents
a falling piece. */
class Piece {
	constructor(type) {
		let centeri = 0, centerj = 5;
		this.squares = [];
		switch (type) {
			case 'T':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				break;
			case 'J':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj + 1, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				break;
			case 'Z':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri + 1, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				break;
			case 'O':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj, true));
				break;
			case 'S':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj, true));
				this.squares.push(new Square(centeri + 1, centerj - 1, true));
				break;
			case 'L':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj - 1, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				break;
			case 'I':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				this.squares.push(new Square(centeri, centerj - 2, true));
				break;
		}

		this.center = this.squares[0];
	}

	/* Moves the piece down if it can, depending on the situation of the grid. */
	move(grid) {
		/* Check if every piece can move down. */
		for (let k = 0; k < this.squares.length; k++) {
			if (grid.squares[this.squares[k].i + 1][this.squares[k].j].visible) {
				/* The next position of this square is occupied by an element of the grid. */
				return false;
			}
		}

		/* All the pieces can move, so move them. */
		for (let k = 0; k < this.squares.length; k++) {
			this.squares[k].move(DIR_DOWN);
		}
	}

	display(grid) {
		for (let i = 0; i < this.squares.length; i++) {
			this.squares[i].display(grid);
		}
	}
}


/* This class represents each of the squares in the grid or
in the falling piece. */
class Square {
	constructor(i, j, visible) {
		/* Store some values. */
		this.i = i;
		this.j = j;

		/* Defines the type of square, visible or not. */
		this.visible = visible;
	}

	/* Moves this square in the desired direction. */
	move(direction) {
		if (direction == DIR_DOWN) {
			this.i += 1;
		}
		else if (direction == DIR_RIGHT) {
			this.j += 1;
		}
		else if (direction == DIR_LEFT) {
			this.j -= 1;
		}
	}

	/* Displays this piece depending on the visibility. */
	display(grid) {
		if (this.visible) {
			fill(0, 255, 0);
			stroke(0);
			rect(grid.initialx + this.j * grid.squareSize, grid.initialy + this.i * grid.squareSize, grid.squareSize, grid.squareSize);
		}
	}
}

/* The stopwatch class keeps track of the time an animation
has been running. Each arena has a stopwatch that counts the time
until the piece has to move down, according to its speed. */
class Stopwatch {
	constructor() {
	 	this.startTime = undefined;
		this.running = false;
		this.elapsedTime = undefined;
	}

	/* Starts the stopwatch */
	start() {
		this.startTime = new Date();
		this.running = true;
		this.elapsedTime = undefined;
	}

	/* Stops the stopwatch */
	stop() {
		this.elapsedTime = new Date() - this.startTime;
		this.running = false;
	}

	/* Returns the time elapsed since the beginning of the animation. */
	getElapsedTime() {
		if (this.running) {
			return new Date() - this.startTime;
		}
		else {
			return this.elapsedTime;
		}
	}

	/* Answers if this stopwatch is currently running. */
	isRunning() {
		return this.running;
	}

	/* Resets the stopwatch to the default values. */
	reset() {
		this.elapsedTime = undefined;
	}
}
