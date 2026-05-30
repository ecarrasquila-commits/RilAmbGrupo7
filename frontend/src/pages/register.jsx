// frontend/src/pages/register.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/register.css";
import BgPattern from "../components/auth/bgPattern";
import PasswordField from "../components/auth/PasswordField";

const STRENGTH_LABELS  = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
const STRENGTH_CLASSES = ['', 's1', 's2', 's3', 's4'];

function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function RilAmbRegister() {
  const [fields, setFields] = useState({
    nombres: '', apellidos: '', cedula: '', telefono: '', correo: '', pwd1: '', pwd2: ''
  });
  const [errors, setErrors] = useState({});

  const pwd = fields.pwd1;
  const strength = pwd.length > 0 ? getStrength(pwd) : 0;
  const metLen     = pwd.length >= 8;
  const metUpper   = /[A-Z]/.test(pwd);
  const metNum     = /[0-9]/.test(pwd);
  const metSpecial = /[^A-Za-z0-9]/.test(pwd);
  const allMet     = metLen && metUpper && metNum && metSpecial;
  const showStrength = pwd.length > 0;
  const showReqs     = pwd.length > 0 && !allMet;

  function handleChange(e) {
    const { id, value } = e.target;
    setFields(f => ({ ...f, [id]: value }));
    setErrors(er => ({ ...er, [id]: false }));

    // live confirm validation
    if (id === 'pwd2' && value.length > 0) {
      setErrors(er => ({ ...er, pwd2: fields.pwd1 !== value }));
    }
    if (id === 'pwd1' && fields.pwd2.length > 0) {
      setErrors(er => ({ ...er, pwd2: value !== fields.pwd2 }));
    }
  }

  async function handleRegister() {
    const { nombres, apellidos, cedula, telefono, correo, pwd1, pwd2 } = fields;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const newErrors = {
      nombres:   nombres.trim().length < 2,
      apellidos: apellidos.trim().length < 2,
      cedula:    cedula.trim().length < 5,
      telefono:  telefono.trim().length < 7,
      correo:    !emailOk,
      pwd1:      pwd1.length < 8,
      pwd2:      pwd1 !== pwd2,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    try {
      await registerUser({
        nombres,
        apellidos,
        telefono,
        correo,
        password: pwd1,
      });

      alert("Registro exitoso");
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  }

  const sc = STRENGTH_CLASSES[strength];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      <div className="wrap">
        <BgPattern/>

        <div className="card">
          <div className="logo">
            <div className="logo-mark">
              <img src="en blanco LOGO cortado.png" alt=""/>
            </div>
            <span className="logo-name">RilAmb</span>
          </div>

          <div className="header">
            <h1>Crear cuenta</h1>
            <p>Completa tus datos para registrarte</p>
          </div>

          <div className="fields">

            <div className="row-2">
              <div className="field">
                <label htmlFor="nombres">Nombres</label>
                <div className="input-wrap">
                  <input
                    type="text" id="nombres" className={`no-icon${errors.nombres ? ' error' : ''}`}
                    placeholder="Juan Carlos" autoComplete="given-name"
                    value={fields.nombres} onChange={handleChange}
                  />
                </div>
                {errors.nombres && <span className="error-msg">Ingresa tus nombres</span>}
              </div>
              <div className="field">
                <label htmlFor="apellidos">Apellidos</label>
                <div className="input-wrap">
                  <input
                    type="text" id="apellidos" className={`no-icon${errors.apellidos ? ' error' : ''}`}
                    placeholder="Pérez García" autoComplete="family-name"
                    value={fields.apellidos} onChange={handleChange}
                  />
                </div>
                {errors.apellidos && <span className="error-msg">Ingresa tus apellidos</span>}
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label htmlFor="cedula">Cédula</label>
                <div className="input-wrap">
                  <input
                    type="text" id="cedula" className={`no-icon${errors.cedula ? ' error' : ''}`}
                    placeholder="1234567890" autoComplete="off" inputMode="numeric" maxLength={12}
                    value={fields.cedula} onChange={handleChange}
                  />
                </div>
                {errors.cedula && <span className="error-msg">Ingresa tu número de cédula</span>}
              </div>
              <div className="field">
                <label htmlFor="telefono">Teléfono</label>
                <div className="input-wrap">
                  <input
                    type="tel" id="telefono" className={`no-icon${errors.telefono ? ' error' : ''}`}
                    placeholder="+57 300 000 0000" autoComplete="tel" inputMode="tel"
                    value={fields.telefono} onChange={handleChange}
                  />
                </div>
                {errors.telefono && <span className="error-msg">Ingresa tu teléfono</span>}
              </div>
            </div>

            <div className="section-sep">
              <div className="section-sep-line"></div>
              <span>Acceso</span>
              <div className="section-sep-line"></div>
            </div>

            <div className="field">
              <label htmlFor="correo">Correo electrónico</label>
              <div className="input-wrap">
                <input
                  type="email" id="correo" className={`no-icon${errors.correo ? ' error' : ''}`}
                  placeholder="tu@empresa.com" autoComplete="email"
                  value={fields.correo} onChange={handleChange}
                />
              </div>
              {errors.correo && <span className="error-msg">Ingresa un correo válido</span>}
            </div>

            <div className="field">
              <label htmlFor="pwd1">Contraseña</label>
              <PasswordField
                id="pwd1"
                wrapperClassName="input-wrap"
                className={errors.pwd1 ? "error" : ""}
                buttonClassName="eye-btn"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                value={fields.pwd1}
                onChange={handleChange}
              />
              {errors.pwd1 && <span className="error-msg">Mínimo 8 caracteres</span>}
              {showStrength && (
                <>
                  <div className="strength-bar">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`strength-seg${i < strength ? ' ' + sc : ''}`}/>
                    ))}
                  </div>
                  <div className="strength-label">{STRENGTH_LABELS[strength]}</div>
                </>
              )}
              {showReqs && (
                <div className="pwd-reqs">
                  {!metLen     && <div className="req-item"><CheckIcon/>Mínimo 8 caracteres</div>}
                  {!metUpper   && <div className="req-item"><CheckIcon/>Una letra mayúscula</div>}
                  {!metNum     && <div className="req-item"><CheckIcon/>Un número</div>}
                  {!metSpecial && <div className="req-item"><CheckIcon/>Un carácter especial (!@#$...)</div>}
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="pwd2">Confirmar contraseña</label>
              <PasswordField
                id="pwd2"
                wrapperClassName="input-wrap"
                className={errors.pwd2 ? "error" : ""}
                buttonClassName="eye-btn"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                value={fields.pwd2}
                onChange={handleChange}
              />
              {errors.pwd2 && <span className="error-msg">Las contraseñas no coinciden</span>}
            </div>

          </div>

          <button className="btn-main" onClick={handleRegister}>Crear cuenta</button>

          <div className="footer">
            ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </>
  );
}