// Detecta si estamos en GitHub Pages (producción) o en local
const isProd = window.location.hostname.includes("github.io");

// URL base de la API
const BASE_URL = isProd
  ? "https://api-node-jrsy.onrender.com/api/scores" // 👉 Render (producción)
  : "http://localhost:3000/api/scores";             // 👉 Local (desarrollo)

export const api = {
  getScores: async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Error al obtener puntajes");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  saveScore: async (newScore) => {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newScore),
      });
      if (!res.ok) throw new Error("Error al guardar puntaje");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
};
