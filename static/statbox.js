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

	/* Returns an object with info about this stat box for the server. */
	packServerUpdate() {
		let pack = {};
		for (let piece of this.pieces) {
			pack[piece] = this.countNumbers[piece];
		}

		return pack;
	}

	/* Receives a JSON object from the server with new info about this stat box. */
	receiveServerUpdate(data) {
		for (let piece of this.pieces) {
			this.countNumbers[piece] = data[piece];
		}
		this.updateAllTextBoxes();
	}

	/* When all the counts have been updated, call this function to update the text boxes. */
	updateAllTextBoxes() {
		for (let piece of this.pieces) {
			this.countTextBoxes[piece].changeText(this.countNumbers[piece]);
		}
	}

	display() {
		super.display();

		for (let piece of this.pieces) {
			this.pieceBoxes[piece].display();
			this.countTextBoxes[piece].display();
		}
	}
}
