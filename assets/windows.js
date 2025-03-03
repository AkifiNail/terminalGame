console.log("Windows.js is loaded");
setTimeout(function () {
  var video = document.getElementById("intro-video");
  if (video) {
    video.classList.add("removed-video");
  }
}, 2000);

// Variables globales
let timeLeft = 30;
let timerInterval;
let modalCount = 0;
let lives = 3;
let modalInterval;
let canReplay = false;

function openWindow() {
  var window = document.getElementById("window");
  var timer = document.querySelector(".timer");
  if (timer.classList.contains("none")) {
    timer.classList.remove("none");
  }
  window.classList.add("opened-window");
  window.classList.remove("closed-window");
}

// Fonction pour créer une modale d'erreur
function createErrorModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  // Position aléatoire à l'écran
  const x = Math.floor(Math.random() * (window.innerWidth - 300));
  const y = Math.floor(Math.random() * (window.innerHeight - 200));
  modal.style.left = `${x}px`;
  modal.style.top = `${y}px`;

  // Contenu de la modale
  modal.innerHTML = `
        <div class="modal-header">
            <span class="modal-title">Erreur</span>
            <button class="close-button" onclick="closeModal(this)">X</button>
        </div>
        <div class="modal-content">
            <p>Une erreur est survenue. Fermez cette fenêtre !</p>
        </div>
        <div class="modal-footer">
            <button class="modal-button" onclick="closeModal(this)">OK</button>
        </div>
    `;

  // Ajouter la modale au conteneur
  document.getElementById("modals-container").appendChild(modal);
  modalCount++;
}

// Fonction pour fermer une modale
function closeModal(button) {
  const modal = button.closest(".modal");
  modal.remove();
  modalCount--;

  // Vérifier si toutes les modales sont fermées
  if (modalCount === 0 && timeLeft > 0 && timeLeft < 10) {
    clearInterval(timerInterval);
    clearInterval(modalInterval);
    document.getElementById("modals-container").innerHTML = "";
    showWinModal();
  }
}

// Fonction pour afficher la modale de victoire
function showWinModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.classList.add("center");

  modal.innerHTML = `
        <div class="modal-header">
            <span class="modal-title">Félicitations !</span>
            <button class="close-button">X</button>
        </div>
        <div class="modal-content">
            <p>Vous avez gagné !</p>
        </div>
        <div class="modal-footer">
        </div>
    `;

  document.getElementById("modals-container").appendChild(modal);

  setTimeout(() => {
    modal.remove(); 
    showMarkusWinMessage(); 
  }, 3000);
}


function showMarkusWinMessage() {
  const markusContainerText = document.getElementById("markus-text-container");
  const markusText = document.getElementById("markus-text");

  markusContainer.style.display = "inline-block"; // Affiche Markus
  markusContainerText.style.display = "block";
  markusText.textContent = "Wow tu es fort"; // Premier message

  setTimeout(() => {
    markusText.textContent = "Ok j'ai compris clique sur rejouer s'il te plaît"; // Deuxième message

    setTimeout(() => {
      showReplayModal(); // Affiche la modale pour rejouer
      setTimeout(() => {
        showTerminalMessage(); // Affiche le message du terminal
      }, 2500); // Attends un peu après la modale avant de lancer le terminal
    }, 2500);
  }, 2000);
}


function showTerminalMessage() {
  const blackScreen = document.querySelector('.black-screen');
  blackScreen.classList.remove('none'); // Affiche l'écran noir

  const terminalTextContainer = document.createElement('div');
  terminalTextContainer.classList.add('terminal-text');
  blackScreen.appendChild(terminalTextContainer);

  const terminalMessage = stepOfMessage == 0 ?  "C'est julius ! Ne lui fais pas confiance, c'est la personne qui nous a enfermés ici." : "J'ai arrété le jeu vite clique sur l'antivirus ! ";
  let index = 0;

  const terminalInterval = setInterval(() => {
    terminalTextContainer.textContent += terminalMessage[index];
    index++;
    if (index === terminalMessage.length) {
      clearInterval(terminalInterval);
      setTimeout(() => {
        showMarkusText("Toi tu es encore là ?", () => {
          showMarkusText("Tu vas jamais me laisser tranquille toi...", () => {
            showMarkusText("Je vais te désactiver !", () => {
              triggerGlitchEffect();
            });
          });
        });
      }, 2000);
    }
  }, 70);
}


function showMarkusText(text, callback) {
  const markusContainerText = document.getElementById("markus-text-container");
  const markusText = document.getElementById("markus-text");

  markusContainer.style.display = "inline-block"; // Affiche Markus
  markusContainerText.style.display = "block";
  markusText.textContent = text; // Texte de Markus

  if (callback) {
    setTimeout(callback, 3000);
  }
}


function triggerGlitchEffect() {
  const blackScreen = document.querySelector('.black-screen');
  blackScreen.classList.add('glitch-effect'); 

  setTimeout(() => {
    blackScreen.classList.add('none'); 
    showMarkusText("Reprenons... Clique sur rejouer.");
   
    showReplayModal2(); 
  }, 3000);
}



function showReplayModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal", "center");

  modal.innerHTML = `
        <div class="modal-header">
            <span class="modal-title">Rejouer</span>
        </div>
        <div class="modal-content">
            <p>Prêt à recommencer ?</p>
        </div>
        <div class="modal-footer">
            <button class="modal-button" id="replay-buttonD">Rejouer</button>
        </div>
    `;

  document.getElementById("modals-container").appendChild(modal);
} 



function showReplayModal2() {
  document.getElementById("modals-container").innerHTML = "";
  const modal = document.createElement("div");
  modal.classList.add("modal", "center");

  modal.innerHTML = `
        <div class="modal-header">
            <span class="modal-title">Rejouer</span>
        </div>
        <div class="modal-content">
            <p>Prêt à recommencer ?</p>
        </div>
        <div class="modal-footer">
            <button class="modal-button" id="replay-buttonD">Rejouer</button>
        </div>
    `;

  document.getElementById("modals-container").appendChild(modal);

  const replayButton = document.getElementById("replay-buttonD");
  replayButton.addEventListener("click", function () {
    document.getElementById("modals-container").innerHTML = "";
    startIntenseGame();
  });
} 


// Fonction pour afficher la modale de défaite
function showLoseModal() {
  lives--;
  document.getElementById("lives").textContent = lives;
  if (lives === 0) {
    window.close();
  }
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.classList.add("center");

  modal.innerHTML = `
        <div class="modal-header">
            <span class="modal-title">Dommage !</span>
            <button class="close-button">X</button>
        </div>
        <div class="modal-content">
            <p>Vous avez perdu !</p>
        </div>
        <div class="modal-footer">
            <button class="modal-button" onclick="restartGame()">Rejouer</button>
        </div>
    `;

  document.getElementById("modals-container").appendChild(modal);
}

// Fonction pour redémarrer le jeu
function restartGame() {
  document.getElementById("lives").textContent = lives;
  startGame();
}

// Fonction pour démarrer le jeu
function startGame() {
  // Réinitialiser le jeu
  markusContainer.style.display = "none";
  var window = document.getElementById("window");
  window.classList.remove("opened-window");
  window.classList.add("closed-window");
  timeLeft = 30;
  modalCount = 0;
  document.getElementById("modals-container").innerHTML = "";
  document.getElementById("time").textContent = timeLeft;

  // Démarrer le timer
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    // Arrêter le jeu si le temps est écoulé
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("modals-container").innerHTML = "";
      showLoseModal();
      
    }
  }, 1000);

  // Créer des modales d'erreur toutes les secondes
   modalInterval = setInterval(() => {
    if (timeLeft > 0) {
      createErrorModal();
    } else {
      clearInterval(modalInterval);
    }
  }, 1500);
}

const phrases = [
  "Bonjour ! Je suis Markus.",
  "Ouais, je suis là pour t'aider.",
  "Clique sur 'Ne pas ouvrir', c'est important !",
  "Tu peux me faire confiance.",
];

// Délai entre chaque phrase (en millisecondes)
const delayBetweenPhrases = 3500; // 3 secondes
const markusContainer = document.getElementById("markus-container");
// Fonction pour afficher les phrases une par une
function showPhrases() {
  const markusContainerText = document.getElementById("markus-text-container");

  const markusText = document.getElementById("markus-text");

  // Afficher le conteneur après 3 secondes
  setTimeout(() => {
    markusContainer.style.display = "inline-block";

    let index = 0;
    // Afficher chaque phrase avec un délai
    const interval = setInterval(() => {
      if (index < phrases.length) {
        markusContainerText.style.display = "block";
        markusText.textContent = phrases[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, delayBetweenPhrases);
  }, 3000);
}

document.getElementById("ordi").addEventListener("click", function () {
  showPhrases();
  let notOpen = document.getElementById("not-open");
  setInterval(() => {
    notOpen.classList.remove("none");
  }, 3000);
});

function startIntenseGame() {
  // Réinitialiser le jeu
  markusContainer.style.display = "none";
  var window = document.getElementById("window");
  window.classList.remove("opened-window");
  window.classList.add("closed-window");
  timeLeft = 30;
  modalCount = 0;
  document.getElementById("modals-container").innerHTML = "";
  document.getElementById("time").textContent = timeLeft;

  // Créer 100 modales d'erreur d'un coup
  for (let i = 0; i < 100; i++) {
    createErrorModal();
  }

  // Démarrer le timer
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    // Arrêter le jeu si le temps est écoulé
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("modals-container").innerHTML = "";
      showLoseModal();
    }
  }, 1000);

  // Créer des modales d'erreur toutes les 50 millisecondes
  modalInterval = setInterval(() => {
    if (timeLeft > 0) {
      createErrorModal();
    } else {
      clearInterval(modalInterval);
    }
  }, 50);

  // Nettoyer les modales après 2 secondes
  setTimeout(() => {
    document.getElementById("modals-container").innerHTML = "";
    clearInterval(modalInterval);
    clearInterval(timerInterval);
    showTerminalMessage2()
  }, 5000);
} 
function showTerminalMessage2() {
  const blackScreen = document.querySelector('.black-screen');
  blackScreen.classList.remove('none');
  blackScreen.classList.remove('glitch-effect'); // Assurez-vous que l'effet de glitch est désactivé
  blackScreen.innerHTML = ''; // Nettoyer l'écran noir

  const terminalTextContainer = document.createElement('div');
  terminalTextContainer.classList.add('terminal-text');
  blackScreen.appendChild(terminalTextContainer);

  const terminalMessage = "J'ai ajouté l'antivirus, exécute-le vite !";
  let index = 0;

  const terminalInterval = setInterval(() => {
    terminalTextContainer.textContent += terminalMessage[index];
    index++;
    if (index === terminalMessage.length) {
      clearInterval(terminalInterval);
      setTimeout(() => {
        showAntivirusButton(); // Afficher le bouton pour exécuter l'antivirus
      }, 2000); // Attendre 2 secondes avant d'afficher le bouton
    }
  }, 70); // Vitesse d'affichage du texte
}