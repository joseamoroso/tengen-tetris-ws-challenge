document.addEventListener('DOMContentLoaded', () => {
	/* Get the URL of the current page to find out the mode. */
	let pathsArray = window.location.pathname.split('/');
	mode = pathsArray[pathsArray.length - 1];

	/* Connect this client to the server with websockets. */
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	/* When the socket is connected, establish the communication interface here. */
	socket.on('connect', () => {
		console.log('Client connected to the server through web sockets');

		if (mode == 'duo') {
			/* Communication when the client wants a new game. */
			document.querySelector('#requestButton').onclick = () => {
				console.log('Requesting duo game to the server');
				socket.emit('requestDuoGame', {});
			};
		}
	});

	/* When the server wants us to wait for another player, remove the button and display
	a waiting text. */
	socket.on('waitingForAnotherPlayer', data => {
		console.log('Received message: waiting for a nother player');
		document.querySelector('#duoContent').innerHTML = '<p>Please wait while we find you another player...</p>';
	});

	socket.on('beginDuoGame', data => {
		console.log('Received message: begin duo game');
		document.querySelector('#duoContent').innerHTML = '';
		client.beginDuoGame();
	});
});

/* Variables to access everywhere. */
let client, mode;

function setup() {
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
