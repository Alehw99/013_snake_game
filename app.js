//var declarations
let canvas;
let ctx;
let size;
let width;
let height;
let tileSize;

let food;
let snake;

const fps = 10;

//Initiation of game Object
function init() {

	tileSize = 20;

	height = tileSize * Math.floor(window.innerHeight / tileSize);
	width = tileSize * Math.floor(window.innerWidth / tileSize);
	size = Math.min(width, height);

	canvas = document.querySelector('#game-canvas');
	canvas.width = size;
	canvas.height = size;
	ctx = canvas.getContext('2d');

	food = new Food(spawnLocation(), 'red');
	snake = new Snake({ x: tileSize * Math.floor(size / (2 * tileSize)), y: tileSize * Math.floor(size / (2 * tileSize)) }, "#39ff14");

}

//Food object
class Food {

	constructor(pos, color) {

		this.x = pos.x;
		this.y = pos.y;
		this.color = color;

	}

	draw() {

		// Drawing Food
		ctx.beginPath();
		ctx.rect(this.x, this.y, tileSize, tileSize);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 3;
		ctx.closePath();

	}

}

function spawnLocation() {

	let gridSize = size / tileSize;

	let xPos, yPos;

	xPos = Math.floor(Math.random() * gridSize) * tileSize;
	yPos = Math.floor(Math.random() * gridSize) * tileSize;

	return{x: xPos, y: yPos};
}

class Snake {

	constructor(pos, color) {

		this.x = pos.x;
		this.y = pos.y;
		this.tail = 
		[{ x: pos.x - tileSize, y: pos.y }, 
		{ x: pos.x - tileSize * 2, y: pos.y }];
		this.velX = 1;
		this.velY = 0;
		this.color = color;


	}

	draw(){

		//Drawing the head of the snake
		ctx.beginPath();
		ctx.rect(this.x, this.y, tileSize, tileSize);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.closePath();

		//Drawing the tail of the snake
		for (var i = 0; i < this.tail.length; i++) {

			ctx.beginPath();
			ctx.rect(this.tail[i].x, this.tail[i].y, tileSize, tileSize);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.strikeStyle = 'black';
			ctx.lineWidth = 3;
			ctx.stroke();
			ctx.closePath();


		}
	}


	// Moving the snake
	move() {

		// Movement of the tail
		for (var i = this.tail.length - 1; i > 0; i--) {
			
			this.tail[i] = this.tail[i - 1];

		}

		// Updating tail to follow the head
		
		if (this.tail.length != 0)
            this.tail[0] = { x: this.x, y: this.y };

		// Movement of the Head
		this.x += this.velX * tileSize;
		this.y += this.velY * tileSize;

	}

	// Direction
	dir(dirX, dirY) {

		this.velX = dirX;
		this.velY = dirY;

	}
	
	// Eat
	eat() {

		if (Math.abs(this.x - food.x) < tileSize && Math.abs(this.y - food.y) < tileSize) {

			this.tail.push({});
			return true;
		}

		return false;

	}

	// Die

	die() {

		for (var i = 0; i < this.tail.length; i++) {
			
			if (Math.abs(this.x - this.tail[i].x) < tileSize && Math.abs(this.y - this.tail[i].y) < tileSize) {

				return true;

			}	

		}

		return false;

	}

	// Border
	border() {

        if (this.x + tileSize > size && this.velX != -1 || this.x < 0 && this.velX != 1)
            this.x = size - this.x;

        else if (this.y + tileSize > size && this.velY != -1 || this.velY != 1 && this.y < 0)
            this.y = size - this.y;

    } //si no funciona con width y height tengo que usar size o crear nuevas variables


}

// Player Imputs
window.addEventListener("keydown", function (evt) {

	if (evt.key === "ArrowUp") {
		evt.preventDefault();
		if ((snake.velY != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)) 
		snake.dir(0, -1);
	}
	else if (evt.key === "ArrowDown") {
        evt.preventDefault();
        if (snake.velY != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, 1);
    }
    else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        if (snake.velX != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(-1, 0);
    }
    else if (evt.key === "ArrowRight") {
        evt.preventDefault();
        if (snake.velX != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(1, 0);
    }

});


function update() {

        if (snake.die()) {
            alert("GAME OVER!!!");
    		clearInterval(interval);
   			window.location.reload()
        }

        snake.border();

        if (snake.eat()) {
            food = new Food(spawnLocation(), "red");
        }

        // Clearing the canvas for redrawing.
        ctx.clearRect(0, 0, width, height);

        food.draw();
        snake.draw();
        snake.move();

       	//console.log(snake.x, snake.y)
}

function game() {

	init();

	interval = setInterval(update, 1000/fps)

}

window.addEventListener("load", function(){

     game();

});

