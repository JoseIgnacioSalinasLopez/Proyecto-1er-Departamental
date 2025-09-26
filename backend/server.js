const express = require('express');
const path = require('path');
const cors = require("cors");
const scoresRouter = require('./scores.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Habilitar CORS
app.use(cors());

// Servir archivos estáticos para pruebas locales
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de la API
app.use('/api/scores', scoresRouter);

// Fallback SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
