// frontend/src/pages/login.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/authService";

// Estilos
import "../styles/login.css";

// Componentes
import BgPattern from "../components/auth/bgPattern";
import AuthLogo from "../components/auth/AuthLogo";
import PasswordField from "../components/auth/PasswordField";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ correo: "", password: "" });

  const validateForm = () => {
    const newErrors = {
      correo: "",
      password: "",
    };

    if (!correo.trim()) {
      newErrors.correo = "Ingresa tu correo electrónico";
    } else if (!emailRegex.test(correo.trim())) {
      newErrors.correo = "Ingresa un correo válido";
    }

    if (!password) {
      newErrors.password = "Ingresa tu contraseña";
    }

    setErrors(newErrors);
    return !newErrors.correo && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await loginUser({ correo, password });

      alert("Login exitoso");
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCorreoChange = (value) => {
    setCorreo(value);
    if (errors.correo) {
      setErrors((current) => ({ ...current, correo: "" }));
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (errors.password) {
      setErrors((current) => ({ ...current, password: "" }));
    }
  };

  const isFormValid = correo.trim() && emailRegex.test(correo.trim()) && password;

  return (
    <>
      <div className="login-wrap">
        {/* Fondo decorativo */}
        <BgPattern />

        <div className="login-card">
          {/* ======================================================
              Logo
          ====================================================== */}
          <AuthLogo
            containerClassName="login-logo"
            markClassName="login-logo-mark"
            textClassName="login-logo-name"
          />

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
                  value={correo}
                  onChange={(e) => handleCorreoChange(e.target.value)}
                />
              </div>
              {errors.correo && (
                <span className="login-error">{errors.correo}</span>
              )}
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

              <PasswordField
                id="password"
                className="login-input"
                wrapperClassName="login-input-wrap"
                buttonClassName="login-eye-btn"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              {errors.password && (
                <span className="login-error">{errors.password}</span>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="login-btn-main"
              disabled={!isFormValid}
            >
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