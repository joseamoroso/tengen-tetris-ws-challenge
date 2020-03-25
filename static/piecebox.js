/* This is a little box where a piece can be represented. */
class PieceBox extends ElementBox {
	constructor(initialx, initialy, width) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, width / 2, false);

		/* Calculate the size of one square. */
		this.size = width / 4;

		/* The piece that will be displayed inside the box. */
		this.piece = undefined;
	}

	/* Updates the stored piece. */
	updatePiece(piece) {
		this.piece = new Piece(undefined);
		for (let k = 0; k < piece.squares.length; k++) {
			/* Calculate positions relative to the center piece. */
			let iRelative = piece.squares[k].i - piece.center.i;
			let jRelative = piece.squares[k].j - piece.center.j;
			this.piece.squares.push(new Square(iRelative, 2 + jRelative, true));
		}
		this.piece.center = this.piece.squares[0];
	}

	/* Display each of the squares in the stored piece. */
	display() {
		super.display();

		if (this.piece != undefined) {
			for (let k = 0; k < this.piece.squares.length; k++) {
				this.piece.squares[k].display(this.initialx, this.initialy, this.size);
			}
		}
	}
}
