// frontend/src/router/index.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Login from "../pages/login";
import RecoverPassword from "../pages/recoverPassword";

// Futuras páginas
// import Register from "../pages/register";


// ======================================================
// Enrutador de la aplicación
// Maneja todas las rutas de la app.
// ======================================================

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================================================
            Rutas públicas
        ====================================================== */}

        <Route path="/" element={<Login />} />
        <Route path="/recover-password" element={<RecoverPassword />} />

        {/* ======================================================
            Futuras rutas
        ====================================================== */}
        {/*
        <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}