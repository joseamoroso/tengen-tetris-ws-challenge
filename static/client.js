
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

        /* Create only one arena while in solo mode. */
		if (this.mode == 'solo') {
			/* Expand all the possible height. */
			let arenaHeight = this.canvasHeight;
			let arenaWidth = 2 * arenaHeight / 3;
			this.arena = new Arena((this.canvasWidth - arenaWidth) / 2, 0, arenaWidth, arenaHeight);
		}
		else if (this.mode == 'duo') {
			/* TODO: create two arenas side by side. */
		}
    }

	/* This function handles input from the keyboard. */
	keyPressed(code) {
		this.arena.keyPressed(code);
	}

	/* Updates all the elements inside the arena. */
	update() {
		this.arena.update();
	}

    display() {
        this.arena.display();
    }
}
