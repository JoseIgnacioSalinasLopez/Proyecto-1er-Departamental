const tablero = document.getElementById("tablero");
const tiempoEl = document.getElementById("tiempo");
const intentosEl = document.getElementById("intentos");
const mensajeVictoria = document.getElementById("mensajeVictoria");
const btnReiniciar = document.getElementById("reiniciar");

const emojis = ["🍎","🍌","🍇","🍉","🍓","🍍"];
let cartas = [];
let primeraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let intentos = 0;
let parejasEncontradas = 0;
let tiempo = 60;
let timer = null;
let juegoIniciado = false;

function iniciarJuego() {
  // Reset
  tablero.innerHTML = "";
  mensajeVictoria.textContent = "";
  mensajeVictoria.classList.remove("perdiste");
  intentos = 0;
  parejasEncontradas = 0;
  tiempo = 60;
  tiempoEl.textContent = tiempo;
  intentosEl.textContent = "0";
  juegoIniciado = false;
  clearInterval(timer);

  // Crear cartas (6 pares -> 12)
  cartas = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5);

  cartas.forEach(valor => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.value = valor;

    carta.innerHTML = `
      <div class="cara frente">❓</div>
      <div class="cara atras">${valor}</div>
    `;

    carta.addEventListener("click", () => voltearCarta(carta));
    tablero.appendChild(carta);
  });
}

function iniciarTimer() {
  timer = setInterval(() => {
    tiempo--;
    tiempoEl.textContent = tiempo;

    if (tiempo <= 0) {
      clearInterval(timer);
      bloquearJuego();
      mensajeVictoria.textContent = "⏰ ¡Se acabó el tiempo! Perdiste 😢";
      mensajeVictoria.classList.add("perdiste");
    }
  }, 1000);
}

function voltearCarta(carta) {
  if (bloqueado || carta.classList.contains("volteada")) return;

  if (!juegoIniciado) {
    juegoIniciado = true;
    iniciarTimer();
  }

  carta.classList.add("volteada");

  if (!primeraCarta) {
    primeraCarta = carta;
  } else {
    segundaCarta = carta;
    intentos++;
    intentosEl.textContent = intentos;
    comprobarPareja();
  }
}

function comprobarPareja() {
  if (primeraCarta.dataset.value === segundaCarta.dataset.value) {
    primeraCarta = null;
    segundaCarta = null;
    parejasEncontradas++;
    if (parejasEncontradas === emojis.length) {
      clearInterval(timer);
      mensajeVictoria.textContent = `🎉 ¡Ganaste en ${intentos} intentos y ${60 - tiempo} segundos!`;
    }
  } else {
    bloqueado = true;
    setTimeout(() => {
      primeraCarta.classList.remove("volteada");
      segundaCarta.classList.remove("volteada");
      primeraCarta = null;
      segundaCarta = null;
      bloqueado = false;
    }, 1000);
  }
}

function bloquearJuego() {
  document.querySelectorAll(".carta").forEach(carta => {
    carta.style.pointerEvents = "none";
  });
}

btnReiniciar.addEventListener("click", iniciarJuego);

// Inicializar
iniciarJuego();
