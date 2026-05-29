// frontend/src/pages/login.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

// Recursos
import logoImg from "../assets/logo.png";

// Estilos
import "../styles/login.css";

// Componentes
import BgPattern from "../components/auth/bgPattern";
import { EyeOpen, EyeClosed } from "../components/auth/passwordEye";

// ======================================================
// Página de inicio de sesión
// ======================================================

export default function Login() {
  // ======================================================
  // Estado
  // ======================================================

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ======================================================
  // Manejadores de eventos
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Conectar con el backend
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // ======================================================
  // Renderizado
  // ======================================================

  return (
    <>
      <div className="login-wrap">
        {/* Fondo decorativo */}
        <BgPattern />

        <div className="login-card">
          {/* ======================================================
              Logo
          ====================================================== */}
          <div className="login-logo">
            <div className="login-logo-mark">
              <img src={logoImg} alt="" />
            </div>

            <span className="login-logo-name">RilAmb</span>
          </div>

          {/* ======================================================
              Encabezado
          ====================================================== */}
          <div className="login-header">
            <h1>Bienvenido de nuevo</h1>
            <p>Accede a tu espacio de trabajo</p>
          </div>

          {/* ======================================================
              Formulario de inicio de sesión
          ====================================================== */}
          <form className="login-fields" onSubmit={handleSubmit}>
            {/* ------------------------------
                Campo de correo electrónico
            ------------------------------ */}
            <div className="login-field">
              <div className="login-field-header login-field-header--single">
                <label htmlFor="email">Correo electrónico</label>
              </div>

              <div className="login-input-wrap">
                <input
                  id="email"
                  className="login-input"
                  type="email"
                  placeholder="tu@empresa.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* ------------------------------
                Campo de contraseña
            ------------------------------ */}
            <div className="login-field">
              <div className="login-field-header">
                <label htmlFor="password">Contraseña</label>

                <Link to="/recover-password" className="login-forgot">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="login-input-wrap">
                <input
                  id="password"
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Mostrar u ocultar contraseña */}
                <button
                  type="button"
                  className={`login-eye-btn${
                    password.length > 0 ? " visible" : ""
                  }`}
                  onClick={togglePasswordVisibility}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {/* Botón de envío */}
            <button type="submit" className="login-btn-main">
              Iniciar sesión
            </button>
          </form>

          {/* ======================================================
              Divisor
          ====================================================== */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <div className="login-divider-line" />
          </div>

          {/* ======================================================
              Pie de página
          ====================================================== */}
          <div className="login-footer">
            ¿No tienes cuenta?{" "}
            <Link to="/register">Crear cuenta</Link>
          </div>
        </div>
      </div>
    </>
  );
}