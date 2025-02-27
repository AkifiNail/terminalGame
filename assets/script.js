class Terminal {
  constructor(terminalId, inputId) {
    this.terminal = document.getElementById(terminalId);
    this.input = document.getElementById(inputId);
    this.commands = {};
    this.history = [];
    this.historyIndex = -1;
    this.firstInteraction = true;
    this.awaitingResponse = false;
    this.awaitingHelpResponse = false;
    this.isPrinting = false;
    this.userName = "";
    this.snakeCompleted = false;
    this.inventory = [];
    this.isInputDisabled = false;

    this.init();
  }

  init() {
    this.input.addEventListener("keydown", (event) => this.handleInput(event));
  }

  handleInput(event) {
    if (this.isPrinting || this.isInputDisabled) return;

    if (event.key === "Enter") {
      const command = this.input.value.trim();
      this.history.push(command);
      this.historyIndex = this.history.length;
      this.executeCommand(command);
      this.input.value = "";
    } else if (event.key === "ArrowUp" && this.history.length > 0) {
      this.historyIndex = Math.max(0, this.historyIndex - 1);
      this.input.value = this.history[this.historyIndex];
    } else if (event.key === "ArrowDown" && this.history.length > 0) {
      this.historyIndex = Math.min(this.history.length, this.historyIndex + 1);
      this.input.value = this.history[this.historyIndex] || "";
    }
  }

  executeCommand(command) {
    this.print(`> ${command}`);

    if (this.firstInteraction) {
      this.printSlow(
        "Il y a quelqu'un ? Réponds-moi avec 'oui' si tu es là.",
        () => {
          this.firstInteraction = false;
          this.awaitingResponse = true;
        }
      );
      return;
    }

    if (this.awaitingResponse && command.toLowerCase() === "oui") {
      this.printSlow("Ah enfin ! Je pensais être seul ici...", () => {
        this.awaitingResponse = false;
        setTimeout(() => {
          this.printSlow(
            "Bon... je crois qu'on est tous les deux bloqués ici...",
            () => {
              this.printSlow(
                "Je pense que c'est la fin pour nous. :(\nÇa fait 10 ans que je suis coincé ici.",
                () => {
                  this.printSlow(
                    "La personne qui m'a enfermé se trouve derrière cette porte secrète.",
                    () => {
                      this.showElement("image", {
                        src: "./assets/images/door.png",
                        alt: "door",
                        top: "20px",
                        right: "40px",
                        height: "150px",
                      });
                      this.printSlow(
                        "Mais je ne trouve pas la clé... Je vais peut-être rester ici pour l'éternité...",
                        () => {
                          this.printSlow(
                            "À moins que tu sois prêt à m'aider ?",
                            () => this.showHelpOptions()
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }, 2000);
      });
      return;
    }

    if (this.awaitingHelpResponse) {
      if (command.toLowerCase() === "ok") {
        this.printSlow(
          "Merci ! Ensemble, nous allons trouver ce code !",
          () => {
            this.awaitingHelpResponse = false;
            this.askName();
          }
        );
      } else if (command.toLowerCase() === "non") {
        this.printSlow(
          "Oh... d'accord... Je suppose que c'est la fin pour moi alors... salut...",
          () => {
            setTimeout(() => {
              window.close();
            }, 5000);
          }
        );
        this.awaitingHelpResponse = false;
      } else {
        this.printSlow("Tape 'ok' pour accepter ou 'non' pour refuser.");
      }
      return;
    }

    if (this.awaitingResponse) {
      this.terminal.innerHTML = "";
      this.userName = command.trim();
      this.printSlow(
        `Salut ${this.userName} ! Moi c'est Julius, et je sais que en tapant la commande "help" tu peux voir la liste des commandes`,
        () => {
          this.awaitingResponse = false;
        }
      );
      return;
    }

    const args = command.split(" ");
    const cmd = args.shift();

    if (this.commands[cmd]) {
      this.commands[cmd](args);
    } else {
      this.printSlow(`Commande inconnue: ${cmd}`);
    }
  }

  print(message) {
    const line = document.createElement("div");
    line.textContent = message;
    this.terminal.appendChild(line);
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  printSlow(message, callback = null) {
    this.isPrinting = true;
    let index = 0;
    const line = document.createElement("div");
    this.terminal.appendChild(line);
    const interval = setInterval(() => {
      line.textContent += message[index];
      index++;
      if (index === message.length) {
        clearInterval(interval);
        this.isPrinting = false;
        if (callback) callback();
      }
    }, 50);
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  showHelpOptions() {
    this.printSlow("[✓] Tape 'ok' pour aider");
    this.printSlow("[X] Tape 'non' pour refuser");
    this.awaitingHelpResponse = true;
  }

  askName() {
    this.printSlow("D'accord ! Quel est ton prénom ?");
    this.awaitingResponse = true;
  }

  showElement(type, options = {}) {
    let element;

    if (type === "image") {
      element = document.createElement("img");
      element.src = options.src;
      element.alt = options.alt || "";
      element.style.position = "absolute";
      element.style.height = options.height || "150px";
      element.style.top = options.top || "30px";
      element.style.right = options.right || "60px";
      element.classList.add("fade-in");
      document.body.appendChild(element);

      setTimeout(() => {
        element.classList.add("visible");
      }, 500);
    }

    if (type === "text") {
      element = document.createElement("div");
      element.textContent = options.text || "";
      element.classList.add("fade-in");
      document.getElementById("terminal").appendChild(element);

      setTimeout(() => {
        element.classList.add("visible");
      }, 500);
    }

    return element;
  }

  disableInput() {
    this.isInputDisabled = true;
    this.input.disabled = true;
    this.input.style.display = "none";
  }

  enableInput() {
    this.isInputDisabled = false;
    this.input.disabled = false;
    this.input.style.display = "block";
  }

  addToInventory(item) {
    this.inventory.push(item);
  }

  registerCommand(name, callback) {
    this.commands[name] = callback;
  }
}

const terminal = new Terminal("terminal", "commandInput");

terminal.registerCommand("help", () => {
  terminal.printSlow("Voici les commandes disponibles :");
  terminal.printSlow("- help");
  terminal.printSlow("- snake");
  terminal.printSlow("- infos");
  terminal.printSlow("- porte");
  terminal.printSlow("- ??? - ??.");
  terminal.printSlow("- ??? - ??.");
});

terminal.registerCommand("infos", () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+[]{}|;:'\",.<>?/";
  let line = document.createElement("div");
  terminal.terminal.appendChild(line);

  terminal.isPrinting = true;
  const interval = setInterval(() => {
    let randomText = "";
    for (let i = 0; i < 10 + Math.random() * 20; i++) {
      randomText += chars[Math.floor(Math.random() * chars.length)];
    }
    line.textContent = randomText;
  }, 50);

  setTimeout(() => {
    clearInterval(interval);
    terminal.isPrinting = false;
  }, 5000);

  terminal.terminal.scrollTop = terminal.terminal.scrollHeight;
});

terminal.registerCommand("snake", () => {
  if (terminal.snakeCompleted) {
    terminal.printSlow("Tu as déjà terminé le jeu Snake avec succès !");
    return;
  }

  terminal.terminal.innerHTML = "";
  terminal.printSlow("Lancement du jeu Snake...");

  terminal.disableInput();

  setTimeout(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    canvas.id = "snakeCanvas";
    canvas.style.border = "1px solid green";
    terminal.terminal.appendChild(canvas);

    let scoreSnake = document.getElementById("score");
    if (scoreSnake) {
      scoreSnake.classList.add("visible");
    }

    const game = new SnakeGame(canvas.id, terminal);
  }, 3000);
});

terminal.registerCommand("/inv", () => {
  if (!terminal.snakeCompleted) {
    terminal.printSlow(
      "Tu n'as pas encore accès à l'inventaire. Termine le jeu Snake d'abord !"
    );
    return;
  }

  if (terminal.inventory.length === 0) {
    terminal.printSlow("Ton inventaire est vide.");
  } else {
    terminal.printSlow("Voici ton inventaire :");
    terminal.inventory.forEach((item) => {
      terminal.printSlow(`- ${item}`);
    });
  }
});

terminal.registerCommand("porte", () => {
  const hasLamp = terminal.inventory.some((item) => item.includes("Lampe"));

  if (hasLamp) {
    terminal.printSlow(
      "Vous êtes devant une porte, mais il fait trop sombre pour voir à l'intérieur."
    );
  } else {
    terminal.printSlow(
      "Vous êtes devant une porte, mais il fait trop sombre pour voir à l'intérieur."
    );
  }
});

terminal.registerCommand("/useLampe", () => {
  const hasLamp = terminal.inventory.some((item) => item.includes("Lampe"));

  if (hasLamp) {
    setTimeout(triggerGlitchEffect, 1000);
  } else {
    terminal.printSlow("Vous n'avez pas de lampe dans votre inventaire.");
  }
});

terminal.registerCommand("/useClé", () => {
  const hasKey = terminal.inventory.some((item) => item.includes("Clé"));

  if (hasKey) {
    setTimeout(triggerGlitchEffect, 1000);
  } else {
    terminal.printSlow("Vous n'avez pas de clé dans votre inventaire.");
  }
});

function triggerGlitchEffect() {
  const body = document.body;
  const blackScreen = document.getElementById("blackScreen");

  // Ajouter l'effet de glitch
  body.classList.add("glitch-effect");

  // Après 1 seconde, enlever l'effet de glitch et afficher l'écran noir
  setTimeout(() => {
    body.classList.remove("glitch-effect");
    blackScreen.classList.add("visible");
  }, 1000);

  setTimeout(() => {
    window.location.href = "windows.html";
  }, 4000);
}
