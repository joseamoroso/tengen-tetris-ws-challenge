/* This class will provide the arena the next piece when requested. */
class NextPieceGenerator {
	constructor(mode) {
		this.mode = mode;

		this.pieceBuffer = [];
		this.firstBatch = [];
	}

	/* Receives the first batch of ten pieces from the server. */
	receiveFirstBatch(data) {
		for (let piece of data['pieces']) {
			this.pieceBuffer.push(piece);
			this.firstBatch.push(piece);
		}
	}

	/* Receives a new batch of pieces from the server. */
	receiveBatch(data) {
		for (let piece of data['pieces']) {
			this.pieceBuffer.push(piece);
		}
	}

	/* Sends the first two pieces to the arena specified as an argument. */
	sendFirstPieces(arena) {
		arena.receiveFirstPieces({
			'piece': this.firstBatch[0],
			'nextPiece': this.firstBatch[1]
		});
	}

	/* The arena has asked for the next piece. */
	getNextPiece() {
		let pieceLabel;
		if (this.mode == 'solo') {
			pieceLabel = PIECES[Math.floor(Math.random() * PIECES.length)];
		}
		else if (this.mode == 'duo') {
			pieceLabel = this.pieceBuffer.shift();
		}

		return new Piece(pieceLabel);
	}

	/* If there are less than ten pieces in the buffer, ask the server for more. */
	update() {
		if (this.mode == 'duo' && this.pieceBuffer.length < 10) {
			client.sendMessage('requestNextBatch', {});
		}
	}
}
