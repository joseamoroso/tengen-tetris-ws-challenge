function setup() {
  createCanvas(800, 600);

  /* Create a client in solo mode. */
  client = new Client(800, 600, mode='solo');
}

function draw() {
  background(0);

  //client.update();
  client.display();
}
