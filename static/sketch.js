/* The client object has all the logic for the game. */
let client;

function setup() {
	let canvas = createCanvas(800, 600);

	/* Move the canvas to the appropriate div element. */
	canvas.parent('sketch-holder');

	/* Create a client in solo mode. */
	client = new Client(800, 600, mode='solo');
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
