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
	display(initialx, initialy, size) {
		if (this.visible) {
			fill(0, 255, 0);
			stroke(0);
			rect(initialx + this.j * size, initialy + this.i * size, size, size);
		}
	}
}
