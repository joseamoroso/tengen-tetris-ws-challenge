let socket, mode, client;

document.addEventListener('DOMContentLoaded', () => {
	/* Connect this client to the server through web sockets. */
	socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	/* When the socket is connected, establish the communication interface here. */
	socket.on('connect', () => {
		console.log('Client connected to the server through web sockets');

		let button = document.querySelector('#requestButton');
		if (typeof(button) != 'undefined' && button != null) {
			button.onclick = () => {
				console.log('Requesting duo game to the server');
				socket.emit('requestDuoGame', {});
			}
		}
	});

	/* When the server wants us to wait for another player, remove the button and display
	a waiting text. */
	socket.on('waitingForAnotherPlayer', data => {
		console.log('Received message: waiting for a nother player');
		document.querySelector('#duoContent').innerHTML = '<p>Please wait while we find you another player...</p>';
	});

	/* The server tells us everything is ready to start duo game. Remove everything except the canvas. */
	socket.on('beginDuoGame', data => {
		console.log('Received message: begin duo game');
		document.querySelector('#duoContent').innerHTML = '';
		client.beginDuoGame(data);
	});

	/* The server sends the client an update on the adversary's arena. */
	socket.on('adversaryArenaUpdate', data => {
		console.log('Received message: get adversary arena update');
		client.getAdversaryArenaUpdate(data);
	});

	/* The server sends the client the next piece it requested. */
	socket.on('nextPiece', data => {
		console.log('Received message: next piece');
		client.getNextPiece(data);
	});
});

function setup() {
	/* Find out the mode by looking at the URL. */
	let pathsArray = window.location.pathname.split('/');
	mode = pathsArray[pathsArray.length - 1];

	/* The size of the canvas depends on the game mode. */
	let canvasWidth = mode == 'solo' ? 400 : 800;
	let canvas = createCanvas(canvasWidth, 600);

	/* Move the canvas to the appropriate div element. */
	canvas.parent('sketch-holder');

	/* Create the client. */
	client = new Client(canvasWidth, 600, mode=mode);
}

function draw() {
	background(0);

	client.update();
	client.display();
}

function keyPressed() {
	client.keyPressed(keyCode);
	return false;
}

function keyReleased() {
	client.keyReleased(keyCode);
	return false;
}
