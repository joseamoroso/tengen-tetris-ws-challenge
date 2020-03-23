class NextPieceBoard {
	constructor(initialx, initialy, width, height) {
		/* Store the sizes values. */
		this.initialx = initialx;
		this.initialy = initialy;
		this.width = width;
		this.height = height;

		/* Create a new piece box for the next piece in the space remaining. */
		let pieceBoxWidth = (80 / 100) * width;
		this.pieceBox = new PieceBox(initialx + (width - pieceBoxWidth) / 2, initialy + height / 4, pieceBoxWidth);

		/* Calculate the center of the NEXT text. */
		this.message = 'NEXT';
		this.nextCenterx = this.initialx + this.width / 2;
		this.nextCentery = this.initialy + this.height / 8;
	}

	updatePiece(piece) {
		this.pieceBox.updatePiece(piece);
	}

	display() {
		/* Display the NEXT message at the top of the box. */
		fill(255);
		noStroke();
		textSize(16);
		textAlign(CENTER, CENTER);
		text(this.message, this.nextCenterx, this.nextCentery);

		/* Display the piece stored inside the piece box. */
		this.pieceBox.display();

		/* Display a border around the board. */
		stroke(255);
		line(this.initialx, this.initialy, this.initialx + this.width, this.initialy);
		line(this.initialx + this.width, this.initialy, this.initialx + this.width, this.initialy + this.height);
		line(this.initialx + this.width, this.initialy + this.height, this.initialx, this.initialy + this.height);
		line(this.initialx, this.initialy + this.height, this.initialx, this.initialy);
	}
}
