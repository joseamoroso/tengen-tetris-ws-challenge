/* This is the tetromino piece. It begins at the top and moves down. */
class Piece {
	constructor(type) {
		let centeri = 0, centerj = 5;
		this.squares = [];

		/* Create a different piece depending on the type. */
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
		let canMove = true;
		for (let k = 0; k < this.squares.length; k++) {
			if (!this.squares[k].canMove(direction, grid)) {
				canMove = false;
				break;
			}
		}

		/* If it cannot move down, let the grid take the piece. */
		if (!canMove) {
			if (direction == DIR_DOWN) {
				grid.receive(this);
			}
			return false;
		}

		/* All the squares can move, so move them. */
		for (let k = 0; k < this.squares.length; k++) {
			this.squares[k].move(direction);
		}

		return true;
	}

	/* Displays this piece calling display on each of the squares. */
	display(initialx, initialy, size) {
		for (let i = 0; i < this.squares.length; i++) {
			this.squares[i].display(initialx, initialy, size);
		}
	}
}
