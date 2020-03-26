/* When the game page has finished loading, look at the url
to find out the game mode (solo or duo) */
document.addEventListener('DOMContentLoaded', () => {
	let pathsArray = window.location.pathname.split('/');
	mode = pathsArray[pathsArray.length - 1];
});

/* Global variable that defines the mode (solo or duo) */
let mode;

/* The client object has the logic for the game. */
let client;

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
