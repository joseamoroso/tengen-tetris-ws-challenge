class Client {
	constructor(canvasWidth, canvasHeight, mode) {
		console.log('Creating client object in mode: ' + this.mode);
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.mode = mode;

		/* Create an active arena and optionally an adversary arena. */
		this.activeArena = undefined;
		this.adversaryArena = undefined;
	}

	initializeActiveArena() {
		if (this.mode == 'solo') {
			this.activeArena = new Arena(0, 0, this.canvasWidth, this.canvasHeight);
		}
		else if (this.mode == 'duo') {
			this.activeArena = new Arena(0, 0, this.canvasWidth / 2, this.canvasHeight);
		}
	}

	initializeAdversaryArena() {
		this.adversaryArena = new Arena(this.canvasWidth / 2, 0, this.canvasWidth / 2, this.canvasHeight);
	}

	beginDuoGame() {
		/* Make both arenas undefined. */
		this.activeArena = undefined;
		this.adversaryArena = undefined;
	}

	/* Gets called when a key is pressed. */
	keyPressed(code) {
		if (this.activeArena != undefined) {
			this.activeArena.keyPressed(code);
		}
	}

	/* Gets called when a key is released. */
	keyReleased(code) {
		if (this.activeArena != undefined) {
			this.activeArena.keyReleased(code);
		}
	}

	/* Main loop that updates the arenas. */
	update() {
		if (this.activeArena == undefined) {
			this.initializeActiveArena();
		}
		if (this.adversaryArena == undefined && this.mode == 'duo') {
			this.initializeAdversaryArena();
		}

		this.activeArena.update();
	}

	display() {
		if (this.activeArena != undefined) {
			this.activeArena.display();
		}
		if (this.adversaryArena != undefined) {
			this.adversaryArena.display();
		}
	}
}
