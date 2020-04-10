class TickBox {
	constructor(initialx, initialy, width, height) {
		/* Calculate the center of the ellipse. */
		this.centerx = initialx + width / 2;
		this.centery = initialy + height / 2;

		/* All tick boxes start deselected by default. */
		this.selected = false;
	}

	isSelected() {
		return this.selected;
	}

	select() {
		this.selected = true;
	}

	deselect() {
		this.selected = false;
	}

	/* Draw a little ellipse in the middle if selected. */
	display() {
		if (this.selected) {
			ellipseMode(CENTER);
			fill(0, 255, 0);
			noStroke();
			ellipse(this.centerx, this.centery, TICK_DIAMETER, TICK_DIAMETER);
		}
	}
}
