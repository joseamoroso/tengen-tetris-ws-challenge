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

	/* Receives a piece and keeps it in the grid forever. */
	receive(piece) {
		for (let k = 0; k < piece.squares.length; k++) {
			this.squares[piece.squares[k].i][piece.squares[k].j].visible = true;
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
