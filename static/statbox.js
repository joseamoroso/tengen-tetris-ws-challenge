class StatBox extends ElementBox {
	constructor(initialx, initialy, width, height, pieces) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, true);

		/* Keep a copy of the array of pieces. */
		this.pieces = pieces;

		/* Create piece boxes for each of the pieces on the left sides,
		numerical counters and text messages for the right side. */
		this.pieceBoxes = {};
		this.countNumbers = {};
		this.countTextBoxes = {};
		for (let i = 0; i < pieces.length; i++) {
			this.pieceBoxes[pieces[i]] = new PieceBox(initialx, initialy + i * height / 7, width / 2, height / 7);
			this.pieceBoxes[pieces[i]].updatePiece(new Piece(pieces[i]));
			this.countNumbers[pieces[i]] = 0;
			this.countTextBoxes[pieces[i]] = new TextBox(initialx + width / 2, initialy + i * height / 7, width / 2, height / 7, '0', false);
		}
	}

	/* Receives a piece label and counts +1 to the stats of that piece. */
	updateCounts(label) {
		this.countNumbers[label] += 1;
		this.countTextBoxes[label].changeText(this.countNumbers[label]);
	}

	display() {
		super.display();

		for (let piece of this.pieces) {
			this.pieceBoxes[piece].display();
			this.countTextBoxes[piece].display();
		}
	}
}
