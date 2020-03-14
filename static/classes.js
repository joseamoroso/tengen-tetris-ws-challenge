class Arena {
    constructor(initialx, initialy, width, height) {
        this.initialx = initialx;
        this.initialy = initialy;
        this.width = width;
        this.height = height;

		/* Create a message board at the top. */
        this.messageBoard = new MessageBoard(initialx, initialy, width, height / 10);

		/* Create the grid itself in the space remaining. */
		let gridHeight = 8 * this.height / 10;
		let gridWidth = gridHeight / 2;
		let gridInitialx = this.initialx + (this.width - gridWidth) / 2;
		let gridInitialy = this.initialy + 2 * this.height / 10;
		this.grid = new Grid(gridInitialx, gridInitialy, gridWidth, gridHeight);

		/* Create the current piece, the one falling right now. */
		this.piece;
    }

	/* This function is called in a loop and checks for winning or losing
	conditions and creates new pieces, etc. */
	update() {
		this.piece = new Piece();
	}

    display() {
        /* Display a white border around the arena. */
		stroke(255);
		line(this.initialx, this.initialy, this.initialx + this.width, this.initialy);
		line(this.initialx + this.width, this.initialy, this.initialx + this.width, this.initialy + this.height);
		line(this.initialx + this.width, this.initialy + this.height, this.initialx, this.initialy + this.height);
		line(this.initialx, this.initialy + this.height, this.initialx, this.initialy);

		/* Display the message board. */
		this.messageBoard.display();

		/* Display the grid. */
		this.grid.display();
    }
}

class MessageBoard {
    constructor(initialx, initialy, width, height) {
        this.initialx = initialx;
        this.initialy = initialy;
        this.width = width;
        this.height = height;

        /* Calculate coordinates of the center of the board. */
        this.centerx = this.initialx + this.width / 2;
        this.centery = this.initialy + this.height / 2;

        /* A message board has a message that it can display. */
        this.message = 'Hello';
    }

    /* Receives a new message and replaces the current one. */
    changeMessage(message) {
        this.message = message;
    }

    /* Displays the message board to the screen. */
    display() {
        fill(255);
		textAlign(CENTER);
        text(this.message, this.centerx, this.centery);
    }
}

/* This is the main grid for Tetris, where the pieces are stored. */
class Grid {
	constructor(initialx, initialy, width, height) {
		/* Store these values for later use. */
		this.initialx = initialx;
		this.initialy = initialy;
		this.width = width;
		this.height = height;

		/* Calculate the size of one piece in pixels. */
		this.pieceSize = this.width / 10;

		/* Create a double array to store the pieces. */
		this.pieces = [20];
		for (let i = 0; i < 20; i++)
		{
			this.pieces[i] = [];
			for (let j = 0; j < 10; j++)
			{
				this.pieces[i].push(new Square(this.initialx + j * this.pieceSize, this.initialy + i * this.pieceSize, this.pieceSize));
			}
		}
	}

	/* Display all the squares inside the grid. */
	display () {
		for (let i = 0; i < this.pieces.length; i++)
		{
			for (let j = 0; j < this.pieces[i].length; j++)
			{
				this.pieces[i][j].display();
			}
		}
	}
}

class Piece {
	
}


/* This class represents each of the square pieces in Tetris. */
class Square {
	constructor(initialx, initialy, size) {
		/* Store some values. */
		this.initialx = initialx;
		this.initialy = initialy;
		this.size = size;

		/* Variable that defines the type of square, piece or empty. */
		this.visible = true;
	}

	/* Displays this piece depending on the visibility. */
	display() {
		if (this.visible)
		{
			fill(0, 255, 0);
			noStroke();
			rect(this.initialx, this.initialy, this.size, this.size);
		}
	}
}
