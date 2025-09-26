const buttons = document.querySelectorAll(".choice");
const playerChoiceText = document.getElementById("playerChoice");
const computerChoiceText = document.getElementById("computerChoice");
const outcomeText = document.getElementById("outcome");

const winsText = document.getElementById("wins");
const lossesText = document.getElementById("losses");
const drawsText = document.getElementById("draws");

let wins = 0;
let losses = 0;
let draws = 0;

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const playerChoice = button.dataset.choice;
    const computerChoice = getComputerChoice();
    const outcome = determineWinner(playerChoice, computerChoice);

    // Mostrar elecciones
    playerChoiceText.textContent = `Tú elegiste: ${playerChoice}`;
    computerChoiceText.textContent = `La computadora eligió: ${computerChoice}`;
    outcomeText.textContent = outcome;

    // Actualizar marcador
    if (outcome === "¡Ganaste!") {
      wins++;
      winsText.textContent = wins;
    } else if (outcome === "¡Perdiste!") {
      losses++;
      lossesText.textContent = losses;
    } else {
      draws++;
      drawsText.textContent = draws;
    }
  });
});

function getComputerChoice() {
  const choices = ["piedra", "papel", "tijeras"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(player, computer) {
  if (player === computer) {
    return "¡Empate!";
  }
  if (
    (player === "piedra" && computer === "tijeras") ||
    (player === "papel" && computer === "piedra") ||
    (player === "tijeras" && computer === "papel")
  ) {
    return "¡Ganaste!";
  }
  return "¡Perdiste!";
}
