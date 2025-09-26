// Detecta si estás en producción (Render) o en local
const BASE_URL = window.location.hostname.includes("onrender.com")
  ? "https://api-node-jrsy.onrender.com/scores"
  : "/api/scores";

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
