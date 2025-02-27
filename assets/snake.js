class SnakeGame {
  constructor(canvasId, terminal) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.snake = [
      { x: 40, y: 10 },
      { x: 30, y: 10 },
      { x: 20, y: 10 },
      { x: 10, y: 10 },
    ];
    this.direction = "RIGHT";
    this.food = this.createFood();
    this.score = 0;
    this.gameOver = false;
    this.gameInterval = null;
    this.terminal = terminal;

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
      console.log("Game Over déclenché");
      clearInterval(this.gameInterval);
      this.context.fillStyle = "red";
      this.context.font = "30px 'Courier New', monospace";
      this.context.textAlign = "center";
      this.context.fillText(
        "Game Over!",
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      this.terminal.enableInput();
      this.showRestartButton();
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
      console.log("Collision détectée");
      this.gameOver = true;
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.food = this.createFood();
      if (this.score === 10) {
        this.terminal.snakeCompleted = true; // Marque le jeu comme terminé dans le terminal
        clearInterval(this.gameInterval); // Arrête la boucle de jeu
        this.gameOver = true; // Met le jeu en état "Game Over"

        // Afficher un message de victoire sur le canvas
        this.context.fillStyle = "gold"; // Couleur du texte
        this.context.font = "13px 'Courier New', monospace"; // Police et taille du texte
        this.context.textAlign = "center"; // Centrer le texte horizontalement
        this.context.fillText(
          "Vous avez récupéré une clé de décryptage !",
          this.canvas.width / 2,
          this.canvas.height / 2
        );

        let scoreSnake2 = document.getElementById("score");

        // Nettoyer le canvas et revenir au terminal après un délai
        setTimeout(() => {
          scoreSnake2.classList.remove("visible");
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Nettoie le canvas
          this.canvas.style.display = "none"; // Masque le canvas

          // Revenir à l'affichage du terminal
          this.terminal.terminal.style.display = "block"; // Affiche le terminal
          this.terminal.input.style.display = "block"; // Affiche l'input du terminal

          terminal.terminal.innerHTML = "";

          this.terminal.enableInput();

          this.terminal.printSlow("Bien joué ! Tu as réussi le fameux Snake !");
          this.terminal.printSlow(
            "Tu as récupéré une clé de décryptage dans ton inventaire."
          );
        }, 3000); // Délai de 3 secondes avant de revenir au terminal
        return; // Quitte la méthode pour ne pas continuer la partie
      }
    } else {
      this.snake.pop();
    }

    this.draw();
    document.getElementById("score").textContent = "Score: " + this.score;
  }

  showRestartButton() {
    let restartButton = document.getElementById("restartButton");
    if (!restartButton) {
      console.error("Le bouton de redémarrage n'existe pas dans le HTML.");
      return;
    }
    restartButton.style.display = "block";

    restartButton.addEventListener(
      "click",
      () => {
        this.resetGame();
        restartButton.style.display = "none";
      },
      { once: true }
    );
  }

  checkCollision(head) {
    return this.snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y);
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "green";
    this.snake.forEach((segment) => {
      this.context.fillRect(segment.x, segment.y, 10, 10);
    });

    this.context.fillStyle = "blue";
    this.context.fillRect(this.food.x, this.food.y, 10, 10);
  }

  resetGame() {
    clearInterval(this.gameInterval);
    this.snake = [{ x: 10, y: 10 }];
    this.direction = "RIGHT";
    this.score = 0;
    this.gameOver = false;
    this.food = this.createFood();
    document.getElementById("score").textContent = "Score: " + this.score;
    this.gameInterval = setInterval(() => this.update(), 100);
  }
}
