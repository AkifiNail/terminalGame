setTimeout(function () {
  var video = document.getElementById("intro-video");
  if (video) {
    video.classList.add("removed-video");
  }
}, 2000);


let timeLeft = 30;
let timerInterval;
let modalCount = 0;
let lives = 3;
let modalInterval;
let canReplay = false;
let antivirusClickCount = 0;

function openWindow() {
  var window = document.getElementById("window");
  var timer = document.querySelector(".timer");
  if (timer.classList.contains("none")) {
    timer.classList.remove("none");
  }
  window.classList.add("opened-window");
  window.classList.remove("closed-window");
}


function createErrorModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  
  const x = Math.floor(Math.random() * (window.innerWidth - 300));
  const y = Math.floor(Math.random() * (window.innerHeight - 200));
  modal.style.left = `${x}px`;
  modal.style.top = `${y}px`;

  
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

  
  document.getElementById("modals-container").appendChild(modal);
  modalCount++;
}


function closeModal(button) {
  const modal = button.closest(".modal");
  modal.remove();
  modalCount--;

  
  if (modalCount === 0 && timeLeft > 0 && timeLeft < 10) {
    clearInterval(timerInterval);
    clearInterval(modalInterval);
    document.getElementById("modals-container").innerHTML = "";
    showWinModal();
  }
}


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

  markusContainer.style.display = "inline-block"; 
  markusContainerText.style.display = "block";
  markusText.textContent = "Wow tu es fort"; 

  setTimeout(() => {
    markusText.textContent = "Ok j'ai compris clique sur rejouer s'il te plaît"; 

    setTimeout(() => {
      showReplayModal(); 
      setTimeout(() => {
        showTerminalMessage(); 
      }, 2500); 
    }, 2500);
  }, 2000);
}

function showTerminalMessage() {
  const blackScreen = document.querySelector(".black-screen");
  blackScreen.classList.remove("none"); 

  const terminalTextContainer = document.createElement("div");
  terminalTextContainer.classList.add("terminal-text");
  blackScreen.appendChild(terminalTextContainer);

  const terminalMessage =
    "C'est julius ! Ne lui fais pas confiance, c'est la personne qui nous a enfermés ici.";
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

  markusContainer.style.display = "inline-block"; 
  markusContainerText.style.display = "block";
  markusText.textContent = text; 

  if (callback) {
    setTimeout(callback, 3000);
  }
}

function triggerGlitchEffect() {
  const blackScreen = document.querySelector(".black-screen");
  blackScreen.classList.add("glitch-effect");

  setTimeout(() => {
    blackScreen.classList.add("none");
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


function restartGame() {
  document.getElementById("lives").textContent = lives;
  startGame();
}


function startGame() {
  
  markusContainer.style.display = "none";
  var window = document.getElementById("window");
  window.classList.remove("opened-window");
  window.classList.add("closed-window");
  timeLeft = 30;
  modalCount = 0;
  document.getElementById("modals-container").innerHTML = "";
  document.getElementById("time").textContent = timeLeft;

  
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("modals-container").innerHTML = "";
      showLoseModal();
    }
  }, 1000);

  
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


const delayBetweenPhrases = 3500; 
const markusContainer = document.getElementById("markus-container");

function showPhrases() {
  const markusContainerText = document.getElementById("markus-text-container");

  const markusText = document.getElementById("markus-text");

  
  setTimeout(() => {
    markusContainer.style.display = "inline-block";

    let index = 0;
    
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
  
  markusContainer.style.display = "none";
  var window = document.getElementById("window");
  window.classList.remove("opened-window");
  window.classList.add("closed-window");
  timeLeft = 30;
  modalCount = 0;
  document.getElementById("modals-container").innerHTML = "";
  document.getElementById("time").textContent = timeLeft;

  
  for (let i = 0; i < 100; i++) {
    createErrorModal();
  }

  
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("modals-container").innerHTML = "";
      showLoseModal();
    }
  }, 1000);

  
  modalInterval = setInterval(() => {
    if (timeLeft > 0) {
      createErrorModal();
    } else {
      clearInterval(modalInterval);
    }
  }, 50);

  
  setTimeout(() => {
    document.getElementById("modals-container").innerHTML = "";
    clearInterval(modalInterval);
    clearInterval(timerInterval);
    showTerminalMessage2();
  }, 5000);
}
function showTerminalMessage2() {
  const blackScreen = document.querySelector(".black-screen");
  blackScreen.classList.remove("none");
  blackScreen.classList.remove("glitch-effect"); 
  blackScreen.innerHTML = ""; 

  const terminalTextContainer = document.createElement("div");
  terminalTextContainer.classList.add("terminal-text");
  blackScreen.appendChild(terminalTextContainer);

  const terminalMessage =
    "Ok je t'ai aidé et j'ai ajouté l'antivirus, exécute-le vite !";
  let index = 0;

  const terminalInterval = setInterval(() => {
    terminalTextContainer.textContent += terminalMessage[index];
    index++;
    if (index === terminalMessage.length) {
      clearInterval(terminalInterval);
      setTimeout(() => {
        showAntivirusButton(); 
      }, 2000); 
    }
  }, 60); 
}

function showAntivirusButton() {
  let antivirusButton = document.getElementById("antivirus-button");
  antivirusButton.classList.remove("none");

  let lastMoveTime = 0;

  document.addEventListener("mousemove", function (event) {
    const now = Date.now();
    if (now - lastMoveTime > 200) {
      moveButtonIfClose(antivirusButton, event);
      lastMoveTime = now;
    }
  });

  
  antivirusButton.addEventListener("click", function () {
    antivirusClickCount++;

    if (antivirusClickCount === 2) {
      
      showExecutionModal();
      antivirusButton.classList.add("none");
    }
  });

  
  showMarkusText("Je ne te laisserai pas faire !", () => {
    
    disableTerminal();
  });
}

function moveButtonIfClose(button, event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const buttonRect = button.getBoundingClientRect();
  const buttonX = buttonRect.left + buttonRect.width / 2;
  const buttonY = buttonRect.top + buttonRect.height / 2;

  const distance = Math.sqrt((mouseX - buttonX) ** 2 + (mouseY - buttonY) ** 2);

  if (distance < 100) {
    moveButtonRandomly(button);
  }
}

function moveButtonRandomly(button) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const buttonWidth = button.offsetWidth;
  const buttonHeight = button.offsetHeight;

  const newX = Math.random() * (windowWidth - buttonWidth);
  const newY = Math.random() * (windowHeight - buttonHeight);

  button.style.position = "absolute";
  button.style.left = `${newX}px`;
  button.style.top = `${newY}px`;
}

function showMarkusText(text, callback) {
  const markusContainerText = document.getElementById("markus-text-container");
  const markusText = document.getElementById("markus-text");

  markusContainer.style.display = "inline-block"; 
  markusContainerText.style.display = "block";
  markusText.textContent = text; 

  if (callback) {
    setTimeout(callback, 3000); 
  }
}

function disableTerminal() {
  const blackScreen = document.querySelector(".black-screen");
  blackScreen.classList.add("none"); 
  blackScreen.innerHTML = ""; 

  
  blackScreen.style.transition = "opacity 1s";
  blackScreen.style.opacity = "0";

  setTimeout(() => {
    blackScreen.style.display = "none"; 
  }, 1000);
}

function showExecutionModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal", "center");

  modal.innerHTML = `
        <div class="modal-header">
            <span class="modal-title">Exécution de l'antivirus</span>
        </div>
        <div class="modal-content">
            <p>L'antivirus est en cours d'exécution...</p>
        </div>
        <div class="modal-footer">
            <button class="modal-button" id="close-execution-modal">Fermer</button>
        </div>
    `;

  document.getElementById("modals-container").appendChild(modal);

  
  setTimeout(() => {
    modal.remove();
    killMarkus(); 
  }, 3000);
}

function killMarkus() {
  const markusContainerText = document.getElementById("markus-text-container");
  const markusText = document.getElementById("markus-text");

  
  showMarkusText("Oh non, je ne sais pas quoi...", () => {
    
    markusContainer.style.display = "none";
    markusContainerText.style.display = "none";
  });

  let endScreen = document.querySelector(".end-black-screen");

  setTimeout(() => {
    endScreen.classList.remove("none");
  }, 2000);

  setTimeout(() => {
    window.location.href = "end.html";
  }, 4000);
}

function showMarkusText(text, callback) {
  const markusContainerText = document.getElementById("markus-text-container");
  const markusText = document.getElementById("markus-text");

  markusContainer.style.display = "inline-block"; 
  markusContainerText.style.display = "block";
  markusText.textContent = text; 

  if (callback) {
    setTimeout(callback, 3000); 
  }
}
