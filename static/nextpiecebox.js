class NextPieceBox extends ElementBox {
	constructor(initialx, initialy, width, height) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, true);

		/* A 'NEXT' text will occupy the top fourth of the space. */
		this.nextTextBox = new TextBox(initialx, initialy, width, height / 4, 'NEXT', false);

		/* Create a new PieceBox for the next piece in the space remaining, at the bottom. */
		let pieceBoxWidth = (80 / 100) * width;
		let offsetx = (width - pieceBoxWidth) / 2;
		let offsety = (3 * height / 4 - pieceBoxWidth / 2) / 2;
		this.pieceBox = new PieceBox(initialx + offsetx, initialy + height / 4 + offsety, pieceBoxWidth);
	}

	/* Receives a new piece and updates the piece box inside. */
	updatePiece(piece) {
		this.pieceBox.updatePiece(piece);
	}

	display() {
		super.display();

		/* Display the NEXT message at the top of the box. */
		this.nextTextBox.display();

		/* Display the piece inside the piece box. */
		this.pieceBox.display();
	}
}
