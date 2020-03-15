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

	/* Receives a movement and a grid and simulates the movement inside the grid. */
	canMove(direction, grid) {
		let nexti, nextj;
		if (direction == DIR_DOWN) {
			nexti = this.i + 1;
			nextj = this.j;
		}
		else if (direction == DIR_LEFT) {
			nexti = this.i;
			nextj = this.j - 1;
		}
		else if (direction == DIR_RIGHT) {
			nexti = this.i;
			nextj = this.j + 1;
		}

		/* Check the borders of the canvas */
		if (!(0 <= nexti && nexti < 20) || !(0 <= nextj && nextj < 10)) {
			return false;
		}

		/* Check if this position is already occupied in the grid. */
		if (grid.squares[nexti][nextj].visible) {
			return false;
		}

		/* At this point, the simulation was correct, the square can move. */
		return true;
	}

	/* Displays this piece depending on the visibility. */
	display(initialx, initialy, size) {
		if (this.visible) {
			fill(0, 255, 0);
			stroke(0);
			rect(initialx + this.j * size, initialy + this.i * size, size, size);
		}
	}
}
