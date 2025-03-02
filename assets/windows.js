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
    alert("Félicitations ! Vous avez gagné !");
    clearInterval(timerInterval);
  }
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
      alert("Temps écoulé ! Vous avez perdu.");
      document.getElementById("modals-container").innerHTML = "";
    }
  }, 1000);

  // Créer des modales d'erreur toutes les secondes
  const modalInterval = setInterval(() => {
    if (timeLeft > 0) {
      createErrorModal();
    } else {
      clearInterval(modalInterval);
    }
  }, 900);
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
