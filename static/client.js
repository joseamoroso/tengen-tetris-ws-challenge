
/*document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
	console.log('Socket connected correctly');
	socket.emit('waitingToPlay', {'id': socket.id});
    });

    socket.on('ack', () => {
	console.log('server has acknowlodged me');
    })
});*/

class Client {
	constructor(canvasWidth, canvasHeight, mode) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.mode = mode;
		console.log('Starting game in mode: ' + this.mode);

		/* Create only one arena in solo mode. */
		if (this.mode == 'solo') {
			this.arenas = [new Arena(0, 0, this.canvasWidth, this.canvasHeight)];
		}
		else if (this.mode == 'duo') {
			this.arenas = [];
			this.arenas.push(new Arena(0, 0, this.canvasWidth / 2, this.canvasHeight));
		}
	}

	/* Gets called when a key is pressed. */
	keyPressed(code) {
		this.arenas[0].keyPressed(code);
	}

	/* Gets called when a key is released. */
	keyReleased(code) {
		this.arenas[0].keyReleased(code);
	}

	/* Updates all the elements inside the arena. */
	update() {
		this.arenas[0].update();
	}

	display() {
		this.arenas[0].display();
	}
}
