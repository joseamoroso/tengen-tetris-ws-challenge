class StatBoard {
	constructor(initialx, initialy, width, height, pieces) {
		this.initialx = initialx;
		this.initialy = initialy;
		this.width = width;
		this.height = height;

		/* Keep a copy of the array of pieces. */
		this.pieces = pieces;

		/* Create piece boxes for each of the pieces on the left sides,
		numerical counters and text messages. */
		this.pieceBoxes = {};
		this.countNumbers = {};
		this.countTexts = {};
		let initialxCounts = initialx + width / 2;
		let pieceBoxWidth = (80 / 100) * width / 2;
		let horizontalOffset = (width / 2 - pieceBoxWidth) / 2;
		let verticalBoxOffset = (height / 7 - pieceBoxWidth / 2) / 2;
		for (let i = 0; i < pieces.length; i++) {
			this.pieceBoxes[pieces[i]] = new PieceBox(initialx + horizontalOffset, initialy + i * height / 7 + verticalBoxOffset, pieceBoxWidth);
			this.pieceBoxes[pieces[i]].updatePiece(new Piece(pieces[i]));
			this.countNumbers[pieces[i]] = 0;
			this.countTexts[pieces[i]] = new MessageBoard(initialxCounts, initialy + i * height / 7, width / 2, height / 7, '0', false);
		}
	}

	updateCounts(piece) {
		this.countNumbers[piece] += 1;
		this.countTexts[piece].changeMessage(this.countNumbers[piece]);
	}

	display() {
		for (let piece of this.pieces) {
			this.pieceBoxes[piece].display();
			this.countTexts[piece].display();
		}
	}
}
