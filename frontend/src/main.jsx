// frontend/src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Componente raíz
import App from "./App.jsx";

// ======================================================
// Punto de entrada de la aplicación
// Monta la aplicación React en el DOM.
// ======================================================

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);