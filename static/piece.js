/* This is the tetromino piece. It begins at the top and moves down. */
class Piece {
	constructor(type) {
		this.squares = [];
		this.center = undefined;
		this.type = undefined;

		/* If type is undefined, just create an empty piece. */
		if (type == undefined) {
			return;
		}

		/* If a type was provided, create the piece of the appropriate type. */
		let centeri = 0, centerj = 5;
		this.type = type;
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

		/* Point the center piece to the first one. */
		this.center = this.squares[0];
	}

	/* Tries to move the piece in the requested direction. */
	move(direction, grid) {
		for (let k = 0; k < this.squares.length; k++) {
			if (!this.squares[k].canMove(direction, grid)) {
				return false;
			}
		}

		/* All the squares can move, so the piece can move. */
		for (let k = 0; k < this.squares.length; k++) {
			this.squares[k].move(direction);
		}

		return true;
	}

	/* Tries to rotate this piece inside the grid provided. */
	rotate(grid) {
		/* Create a new piece that is this one rotated. */
		let rotatedPiece = this.createRotatedPiece();
		for (let k = 0; k < rotatedPiece.squares.length; k++) {
			if (!grid.validPosition(rotatedPiece.squares[k].i, rotatedPiece.squares[k].j)) {
				return false;
			}
		}

		/* All the squares occupy valid positions, so copy the rotated piece into this one. */
		this.getValuesFrom(rotatedPiece);
	}

	/* Returns a new piece with the squares of this one rotated. */
	createRotatedPiece() {
		let rotatedPiece = new Piece(undefined);
		for (let k = 0; k < this.squares.length; k++) {
			/* Rotate this square. */
			let newSquare = this.squares[k].rotatedFrom(this.center);
			rotatedPiece.squares.push(newSquare);
		}
		rotatedPiece.center = rotatedPiece.squares[0];

		return rotatedPiece;
	}

	/* Copies the values from the piece given as an argument. */
	getValuesFrom(piece) {
		this.squares = [];
		for (let k = 0; k < piece.squares.length; k++) {
			this.squares.push(new Square(piece.squares[k].i, piece.squares[k].j, true));
		}
		this.center = this.squares[0];
	}

	/* Displays this piece calling display on each of the squares. */
	display(initialx, initialy, size) {
		for (let i = 0; i < this.squares.length; i++) {
			this.squares[i].display(initialx, initialy, size);
		}
	}
}
