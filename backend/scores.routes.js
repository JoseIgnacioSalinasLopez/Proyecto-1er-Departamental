const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const scoresFilePath = path.join(__dirname, 'data/scores.json');

// Leer puntuaciones desde archivo
function readScores() {
  try {
    if (!fs.existsSync(scoresFilePath)) {
      return [];
    }
    const data = fs.readFileSync(scoresFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error("Error leyendo scores:", error);
    return [];
  }
}

// Guardar puntuaciones en archivo
function saveScores(scores) {
  try {
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2));
  } catch (error) {
    console.error("Error guardando scores:", error);
  }
}

// GET /api/scores - Obtiene la lista de puntuaciones
router.get('/', (req, res) => {
  const scores = readScores();
  res.json(scores);
});

// POST /api/scores - Guarda una nueva puntuación
router.post('/', (req, res) => {
  const newScore = req.body;

  if (!newScore.name || typeof newScore.score !== "number") {
    return res.status(400).json({ message: "Formato inválido" });
  }

  const scores = readScores();
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score);

  const topScores = scores.slice(0, 10); // Mantener solo el top 10
  saveScores(topScores);

  res.status(201).json({ message: "Puntuación guardada con éxito." });
});

module.exports = router;
