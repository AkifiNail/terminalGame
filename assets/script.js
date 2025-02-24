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
        this.userName = '';

        this.init();
    }

    init() {
        this.input.addEventListener("keydown", (event) => this.handleInput(event));
    }

    handleInput(event) {
        if (this.isPrinting) return; // Bloquer l'entrée pendant l'affichage progressif

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
            this.printSlow("Il y a quelqu'un ? Réponds-moi avec 'oui' si tu es là.", () => {
                this.firstInteraction = false;
                this.awaitingResponse = true;
            });
            return;
        }

        if (this.awaitingResponse && command.toLowerCase() === "oui") {
            this.printSlow("Ah enfin ! Je pensais être seul ici...", () => {
                this.awaitingResponse = false;
                setTimeout(() => {
                    this.printSlow("Bon... je crois qu'on est tous les deux bloqués ici...", () => {
                        this.printSlow("Je pense que c'est la fin pour nous. :(\nÇa fait 10 ans que je suis coincé ici.", () => {
                            this.printSlow("La personne qui m'a enfermé se trouve derrière cette porte secrète.", () => {
                                // Affiche la porte après le texte avec un fade-in
                                this.showElement("image", { 
                                    src: "./assets/images/door.png", 
                                    alt: "door", 
                                    top: "20px", 
                                    right: "40px",
                                    height: "150px"
                                });
                                this.printSlow("Mais je ne trouve pas la clé... Je vais peut-être rester ici pour l'éternité...", () => {
                                    this.printSlow("À moins que tu sois prêt à m'aider ?", () => this.showHelpOptions());
                                });
                            });
                        });
                    });
                }, 2000);
            });
            return;
        }

        if (this.awaitingHelpResponse) {
            if (command.toLowerCase() === "ok") {
                this.printSlow("Merci ! Ensemble, nous allons trouver ce code !", () => {
                    this.awaitingHelpResponse = false;
                    this.askName(); // Demander le prénom après l'acceptation de l'aide
                });
            } else if (command.toLowerCase() === "non") {
                this.printSlow("Oh... d'accord... Je suppose que c'est la fin pour moi alors... salut...", () => {
                    setTimeout(() => {
                        window.close();
                    }, 5000);
                });
                this.awaitingHelpResponse = false;
            } else {
                this.printSlow("Tape 'ok' pour accepter ou 'non' pour refuser.");
            }
            return;
        }

        // Traitement du prénom
        if (this.awaitingResponse) {
            this.userName = command.trim();
            this.printSlow(`Salut ${this.userName} ! Moi c'est Julius, et...`, () => {
                this.awaitingResponse = false; // Arrête d'attendre une réponse
            });
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
        this.awaitingResponse = true;  // Attente de la réponse du nom
    }

    // Fonction générique pour afficher des éléments (image ou texte)
    showElement(type, options = {}) {
        let element;

        // Si l'élément est une image
        if (type === "image") {
            element = document.createElement("img");
            element.src = options.src;
            element.alt = options.alt || "";
            element.style.position = "absolute";
            element.style.height = options.height || "150px";
            element.style.top = options.top || "30px";
            element.style.right = options.right || "60px";
            element.classList.add("fade-in"); // Ajouter la classe fade-in
            document.body.appendChild(element);

            // Afficher l'élément avec un délai
            setTimeout(() => {
                element.classList.add("visible");
            }, 500); // Un délai pour assurer l'affichage après le texte
        }

        // Si l'élément est du texte
        if (type === "text") {
            element = document.createElement("div");
            element.textContent = options.text || "";
            element.classList.add("fade-in"); // Ajouter la classe fade-in
            document.getElementById("terminal").appendChild(element);

            // Afficher l'élément avec un délai
            setTimeout(() => {
                element.classList.add("visible");
            }, 500); // Un délai pour assurer l'affichage après le texte
        }

        // Retourner l'élément pour une manipulation ultérieure
        return element;
    }

    registerCommand(name, callback) {
        this.commands[name] = callback;
    }
}

const terminal = new Terminal("terminal", "commandInput");

// Ajout de commandes dynamiques
terminal.registerCommand("help", () => {
    terminal.printSlow("Voici les commandes disponibles :");
    terminal.printSlow("[✓] help - Affiche cette aide");
    terminal.printSlow("[✓] snake - Lance un jeu de serpent");
    terminal.printSlow("[✓] infos - Affiche des informations sur la situation");
    terminal.printSlow("[???] ??? - ??.");
    terminal.printSlow("[???] ??? - ??.");
    terminal.printSlow("[???] ??? - ??.");
    terminal.printSlow("Il y a des commandes secrètes à découvrir. Bonne chance !");
});

