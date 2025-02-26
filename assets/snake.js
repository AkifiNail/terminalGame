class SnakeGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.snake = [{ x: 10, y: 10 }];
    this.direction = "RIGHT";
    this.food = this.createFood();
    this.score = 0;
    this.gameOver = false;
    this.gameInterval = null;

    this.init();
  }

  init() {
    document.addEventListener("keydown", (e) => this.changeDirection(e));
    this.gameInterval = setInterval(() => this.update(), 100);
  }

  changeDirection(event) {
    if (event.key === "ArrowUp" && this.direction !== "DOWN") {
      this.direction = "UP";
    } else if (event.key === "ArrowDown" && this.direction !== "UP") {
      this.direction = "DOWN";
    } else if (event.key === "ArrowLeft" && this.direction !== "RIGHT") {
      this.direction = "LEFT";
    } else if (event.key === "ArrowRight" && this.direction !== "LEFT") {
      this.direction = "RIGHT";
    }
  }

  createFood() {
    const x = Math.floor((Math.random() * this.canvas.width) / 10) * 10;
    const y = Math.floor((Math.random() * this.canvas.height) / 10) * 10;
    return { x, y };
  }

  update() {
    if (this.gameOver) {
      clearInterval(this.gameInterval);
      this.context.fillStyle = "red";
      this.context.font = "30px Arial";
      this.context.fillText(
        "Game Over!",
        this.canvas.width / 4,
        this.canvas.height / 2
      );
      this.showRestartButton(); // Ajoute un bouton Restart
      return;
    }

    const head = { ...this.snake[0] };

    if (this.direction === "UP") head.y -= 10;
    else if (this.direction === "DOWN") head.y += 10;
    else if (this.direction === "LEFT") head.x -= 10;
    else if (this.direction === "RIGHT") head.x += 10;

    if (
      head.x < 0 ||
      head.x >= this.canvas.width ||
      head.y < 0 ||
      head.y >= this.canvas.height ||
      this.checkCollision(head)
    ) {
      this.gameOver = true;
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.food = this.createFood();
      if (this.score === 10) {
        alert("You Win!");
        this.resetGame();
      }
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  // Fonction pour afficher un bouton Restart
  showRestartButton() {
    let restartButton = document.getElementById("restartButton");

    if (!restartButton) {
      restartButton = document.createElement("button");
      restartButton.id = "restartButton";
      restartButton.textContent = "Restart";
      restartButton.style.position = "absolute";
      restartButton.style.top = "50%";
      restartButton.style.left = "50%";
      restartButton.style.transform = "translate(-50%, -50%)";
      restartButton.style.padding = "10px 20px";
      restartButton.style.fontSize = "16px";
      restartButton.style.backgroundColor = "#ff0000";
      restartButton.style.color = "#fff";
      restartButton.style.border = "none";
      restartButton.style.cursor = "pointer";

      document.body.appendChild(restartButton);

      restartButton.addEventListener("click", () => {
        this.resetGame();
        restartButton.remove();
      });
    }
  }

  checkCollision(head) {
    return this.snake.some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the snake
    this.context.fillStyle = "green";
    this.snake.forEach((segment) => {
      this.context.fillRect(segment.x, segment.y, 10, 10);
    });

    // Draw the food
    this.context.fillStyle = "blue";
    this.context.fillRect(this.food.x, this.food.y, 10, 10);

    // Draw the score
    this.context.fillStyle = "green";
    this.context.font = "20px Arial";
    this.context.fillText("Score: " + this.score, 10, 20);
  }

  resetGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = "RIGHT";
    this.score = 0;
    this.gameOver = false;
    this.food = this.createFood();
    this.gameInterval = setInterval(() => this.update(), 100);
  }
}
