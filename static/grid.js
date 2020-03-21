/* This is the main grid for Tetris, where the squares that fall to the floor
are stored. */
class Grid {
	constructor(initialx, initialy, width, height) {
		/* Store values for later use. */
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

	/* Receives a piece and stores its squares. */
	receive(piece) {
		for (let k = 0; k < piece.squares.length; k++) {
			this.squares[piece.squares[k].i][piece.squares[k].j].visible = true;
		}
	}

	/* Decides if the position is valid inside the grid */
	validPosition(i, j) {
		/* Check the borders of the canvas */
		if (!(0 <= i && i < 20) || !(0 <= j && j < 10)) {
			return false;
		}

		/* Check if this position is already occupied in the grid. */
		if (this.squares[i][j].visible) {
			return false;
		}

		return true;
	}

	/* After a piece drops in the grid, this function gets called to assign
	scores if needed and clean full lines. */
	assignScoresAndClean() {
		/* Get a list of the lines that are full of squares. */
		let fullLines = [];
		let lineFull = false;
		for (let i = 0; i < 20; i++) {
			lineFull = true;
			for (let j = 0; j < 10; j++) {
				if (!this.squares[i][j].visible) {
					lineFull = false;
					break;
				}
			}

			/* If this line is full, add it to the list. */
			if (lineFull) {
				fullLines.push(i);
			}
		}

		this.cleanLines(fullLines);
		return this.getScore(fullLines);
	}

	/* Clears the full lines given as indexes. Whenever a line is cleared, the
	grid moves downwards. */
	cleanLines(fullLines) {
		for (let i = 0; i < fullLines.length; i++) {
			/* Iterate from the current line to the top. */
			for (let k = fullLines[i]; k >= 1; k--) {
				/* Copy the (k-1)-th line into the k-th line. */
				for (let j = 0; j < 10; j++) {
					this.squares[k][j].visible = this.squares[k - 1][j].visible;
				}
			}
		}
	}

	getScore(fullLines) {
		/* Get the groups of lines that are next to each other. */
		let groupLines = [];
		let currentGroup = 0;
		groupLines.push(1);
		for (let i = 1; i < fullLines.length; i++) {
			if (fullLines[i] == fullLines[i - 1] + 1) {
				/* Lines are consecutive. */
				groupLines[currentGroup] += 1;
			}
			else {
				groupLines.push(1);
				currentGroup += 1;
			}
		}

		let score = 0;
		for (let k = 0; k < groupLines.length; k++) {
			if (groupLines[k] == 1) {
				score += 40;
			}
			else if (groupLines[k] == 2) {
				score += 100;
			}
			else if (groupLines[k] == 3) {
				score += 300;
			}
			else if (groupLines[k] == 4) {
				score += 1200;
			}
		}

		return score;
	}

	/* Displays the contents of the grid. */
	display () {
		/* Display a border around the grid. */
		stroke(255);
		line(this.initialx, this.initialy, this.initialx + this.width, this.initialy);
		line(this.initialx + this.width, this.initialy, this.initialx + this.width, this.initialy + this.height);
		line(this.initialx + this.width, this.initialy + this.height, this.initialx, this.initialy + this.height);
		line(this.initialx, this.initialy + this.height, this.initialx, this.initialy);

		/* Display each of the squares */
		for (let i = 0; i < this.squares.length; i++) {
			for (let j = 0; j < this.squares[i].length; j++) {
				this.squares[i][j].display(this.initialx, this.initialy, this.squareSize);
			}
		}
	}
}
