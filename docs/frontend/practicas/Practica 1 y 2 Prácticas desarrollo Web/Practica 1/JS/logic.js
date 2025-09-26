const button = document.getElementById("toggleContact");
const contact = document.getElementById("contact");

button.addEventListener("click", () => {
  contact.classList.toggle("hidden");
  button.textContent = contact.classList.contains("hidden")
    ? "Mostrar contacto"
    : "Ocultar contacto";
});
