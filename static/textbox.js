/* Class that represents a simple text box that can be displayed. */
class TextBox extends ElementBox {
	constructor(initialx, initialy, width, height, initialText, border) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, border);

		/* Calculate the coordinates of the center of the box. */
		this.centerx = this.initialx + this.width / 2;
		this.centery = this.initialy + this.height / 2;

		/* Keep the initial text. */
		this.text = initialText;
	}

	/* Replaces the text. */
	changeText(text) {
		this.text = text;
	}

	display() {
		super.display();

		/* Display the text centered. */
		fill(255);
		noStroke();
		textSize(DEFAULT_TEXT_SIZE);
		textAlign(CENTER, CENTER);
		text(this.text, this.centerx, this.centery);
	}
}
