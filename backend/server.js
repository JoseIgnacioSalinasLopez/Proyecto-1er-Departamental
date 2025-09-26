const express = require('express');
const path = require('path');
const scoresRouter = require('./scores.routes');

const app = express();
const PORT = process.env.PORT || 3000; // 👈 Render asigna el puerto

app.use(express.json());

// Sirve archivos estáticos desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// Configura las rutas de la API (ahora en /api/scores)
app.use('/api/scores', scoresRouter);

// Fallback: si no encuentra ruta, devuelve index.html (SPA)
app.get('/users/*path', (req, res) => {
  // Ahora el parámetro tiene nombre
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
