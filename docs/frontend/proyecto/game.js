import { api } from './api.js';

// Configuración inicial
const DINO_WIDTH = 50;
const DINO_HEIGHT = 80;
const GRAVITY = 0.7;
const JUMP_POWER = -15; 
const MIN_OBSTACLE_DISTANCE = 350; 
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 50;

// Variables del juego
let canvas, ctx;
let gameLoopInterval, scoreLoopInterval, speedUpInterval;
let isJumping = false;
let yVelocity = 0;
let score = 0;
let highScore = 0;
let gameSpeed = 5;
let level = 1;
let obstacles = [];
let isGameOver = false;

// Elementos del DOM
const scoreDisplay = document.getElementById('score-display');
const highScoreDisplay = document.getElementById('high-score-display');
const levelDisplay = document.getElementById('level-display');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restartGameBtn');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const playerNameInput = document.getElementById('player-name');
const saveMessage = document.getElementById('save-message');

// Estado del jugador
let dino = {
    x: 50,
    y: 350,
    width: DINO_WIDTH,
    height: DINO_HEIGHT
};

// Imagen del jugador
let dinoImage = new Image();
let isDinoImageLoaded = false;
dinoImage.src = 'assets/caballero.png';
dinoImage.onload = () => {
    isDinoImageLoaded = true;
};

// Imagen del obstáculo
let obstacleImage = new Image();
let isObstacleImageLoaded = false;
obstacleImage.src = 'assets/enemigo.png';
obstacleImage.onload = () => {
    isObstacleImageLoaded = true;
};

let backgroundImage = new Image();
let isBackgroundLoaded = false;

backgroundImage.src = 'assets/fondo.png';
backgroundImage.onload = () => {
    isBackgroundLoaded = true;
};
backgroundImage.onerror = (e) => {
    console.error("❌ Error al cargar fondo:", backgroundImage.src, e);
};

// Funciones del juego
export function initializeGame() {
    dino.y = 350;
    yVelocity = 0;
    isJumping = false;
    score = 0;
    gameSpeed = 5;
    level = 1;
    obstacles = [];
    isGameOver = false;
    gameOverScreen.classList.add('hide');
    playerNameInput.value = '';
    saveMessage.textContent = '';
    
    scoreDisplay.textContent = 'Puntuación: 0';
    levelDisplay.textContent = 'Nivel: 1';
    
    // Iniciar bucles del juego
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (scoreLoopInterval) clearInterval(scoreLoopInterval);
    if (speedUpInterval) clearInterval(speedUpInterval);
    
    gameLoopInterval = setInterval(gameLoop, 1000 / 60);
    scoreLoopInterval = setInterval(updateScore, 100);
    
    // Aumentar la velocidad del juego con el tiempo
    setTimeout(() => {
        speedUpInterval = setInterval(() => {
            gameSpeed += 0.25;
            level = Math.floor((gameSpeed - 5) / 0.25) + 1; // Calcula el nivel
            levelDisplay.textContent = `Nivel: ${level}`;
        }, 2000); // Aumenta la velocidad cada 2 segundos
    }, 20000); // Comienza a aumentar después de 20 segundos
    
    document.addEventListener('keydown', handleJump);
}

function gameLoop() {
    if (isGameOver) return;
    update();
    draw();
    checkCollision();
}

function updateScore() {
    if (isGameOver) return;
    score++;
    scoreDisplay.textContent = `Puntuación: ${score}`;
}

function update() {
    yVelocity += GRAVITY;
    dino.y += yVelocity;
    
    if (dino.y + dino.height > canvas.height) {
        dino.y = canvas.height - dino.height;
        isJumping = false;
    }

    let lastObstacle = obstacles[obstacles.length - 1];
    if (!lastObstacle || (canvas.width - lastObstacle.x) > (MIN_OBSTACLE_DISTANCE + Math.random() * 200)) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - OBSTACLE_HEIGHT,
            width: OBSTACLE_WIDTH,
            height: OBSTACLE_HEIGHT
        });
    }
    
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });
    
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}




function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
if (isBackgroundLoaded) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
} else {
    ctx.fillStyle = '#fbbf24'; // color de respaldo
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


    // Suelo
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

    // Jugador
    if (isDinoImageLoaded) {
        ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    } else {
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }
    
    // Obstáculos
    obstacles.forEach(obstacle => {
        if (isObstacleImageLoaded) {
            ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
            ctx.fillStyle = '#864e4eff';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    });
}







function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            gameOver();
        }
    });
}

function handleJump(event) {
    if (event.key === ' ' && !isJumping && !isGameOver) {
        isJumping = true;
        yVelocity = JUMP_POWER;
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    clearInterval(scoreLoopInterval);
    if (speedUpInterval) clearInterval(speedUpInterval);
    
    gameOverScreen.classList.remove('hide');
    finalScoreDisplay.textContent = score;
    
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = `Máximo: ${highScore}`;
        localStorage.setItem('highScore', highScore);
    }
    
    document.removeEventListener('keydown', handleJump);
}

restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hide');
    initializeGame();
});

saveScoreBtn.addEventListener('click', async () => {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        saveMessage.textContent = 'Por favor, ingresa tu nombre.';
        return;
    }
    
    const newScore = {
        name: playerName,
        score: score,
        level: level
    };
    
    try {
        saveMessage.textContent = 'Guardando...';
        await api.saveScore(newScore);
        saveMessage.textContent = 'Puntuación guardada con éxito.';
    } catch (error) {
        saveMessage.textContent = 'Error al guardar la puntuación. Intenta de nuevo.';
        console.error(error);
    }
});

function loadHighScore() {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
        highScore = parseInt(storedHighScore);
        highScoreDisplay.textContent = `Máximo: ${highScore}`;
    }
}
window.onload = () => {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  loadHighScore();   // carga puntuación máxima guardada
  initializeGame();  // arranca el juego
};

