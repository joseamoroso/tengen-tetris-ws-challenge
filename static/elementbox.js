/* Basic box that acts as a container and may display a border. */
class ElementBox {
	constructor(initialx, initialy, width, height, border) {
		this.initialx = initialx;
		this.initialy = initialy;
		this.width = width;
		this.height = height;
		this.border = border;
	}

	display() {
		/* Display a border around the box if requested. */
		if (this.border) {
			stroke(255);
			strokeWeight(DEFAULT_BORDER_STROKE_WEIGHT);
			line(this.initialx, this.initialy, this.initialx + this.width, this.initialy);
			line(this.initialx + this.width, this.initialy, this.initialx + this.width, this.initialy + this.height);
			line(this.initialx + this.width, this.initialy + this.height, this.initialx, this.initialy + this.height);
			line(this.initialx, this.initialy + this.height, this.initialx, this.initialy);
		}
	}
}
