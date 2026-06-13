// frontend/src/pages/recoverPassword.jsx

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Estilos
import "../../styles/authentication/recoverPassword.css";

// Componentes
import BgPattern from "../../components/authentication/bgPattern";
import ProgressDots from "../../components/authentication/progressDots";
import PasswordField from "../../components/authentication/PasswordField";
import AuthLogo from "../../components/authentication/AuthLogo";
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../../services/authService";


// ======================================================
// Helpers
// ======================================================
function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRENGTH_LABELS  = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
const STRENGTH_CLASSES = ['', 's1', 's2', 's3', 's4'];

// ======================================================
// Iconos SVG
// ======================================================
const IconLock = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconAlertCircle = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconCheckmark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ======================================================
// Página de recuperación de contraseña
// ======================================================
export default function RecoverPassword() {
  const navigate = useNavigate();

  // ======================================================
  // Estado
  // ======================================================

  // Pantalla actual: 'email' | 'confirm' | 'newpwd' | 'success'
  const [screen, setScreen] = useState('email');

  // Pantalla 1 - Email
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailAlert, setEmailAlert] = useState({ show: false, msg: '' });
  const [loadingSend, setLoadingSend] = useState(false);

  // Pantalla 2 - OTP
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [otpErrors, setOtpErrors] = useState([false, false, false, false, false, false]);
  const [otpErrMsg, setOtpErrMsg] = useState(false);
  const [codeAlert, setCodeAlert] = useState({ show: false, msg: '' });
  const [resendAlert, setResendAlert] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [verifyDisabled, setVerifyDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [expireText, setExpireText] = useState('60s');
  const [expireExpired, setExpireExpired] = useState(false);
  const resendIntervalRef = useRef(null);

  // Pantalla 3 - Nueva contraseña
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [pwd1Error, setPwd1Error] = useState(false);
  const [pwd2Error, setPwd2Error] = useState(false);
  const [pwdAlert, setPwdAlert] = useState({ show: false, msg: '' });
  const [loadingSave, setLoadingSave] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthVisible, setStrengthVisible] = useState(false);
  const [reqsMet, setReqsMet] = useState({ len: false, upper: false, num: false, special: false });

  // ======================================================
  // Efectos
  // ======================================================

  useEffect(() => () => clearInterval(resendIntervalRef.current), []);

  // ======================================================
  // Manejadores de eventos
  // ======================================================

  const startResendCountdown = useCallback((seconds) => {
    clearInterval(resendIntervalRef.current);
    setResendDisabled(true);
    setVerifyDisabled(false);
    let remaining = seconds;

    const tick = () => {
      setResendCountdown(remaining > 0 ? remaining : 0);
      setExpireText(remaining > 0 ? remaining + 's' : 'Expirado');
      setExpireExpired(remaining <= 0);
      if (remaining <= 0) {
        clearInterval(resendIntervalRef.current);
        setResendDisabled(false);
        setVerifyDisabled(true);
        setCodeAlert({ show: true, msg: 'El código expiró. Reenvía uno nuevo.' });
      }
      remaining--;
    };
    tick();
    resendIntervalRef.current = setInterval(tick, 1000);
  }, []);

  const resetAll = () => {
    clearInterval(resendIntervalRef.current);
    setEmail(''); setEmailError(false); setEmailAlert({ show: false, msg: '' });
    setUserEmail('');
    setOtp(['', '', '', '', '', '']);
    setOtpErrors([false, false, false, false, false, false]);
    setOtpErrMsg(false); setCodeAlert({ show: false, msg: '' }); setResendAlert(false);
    setResendCountdown(0); setExpireText('600s'); setExpireExpired(false);
    setResendDisabled(true); setVerifyDisabled(false);
    setPwd1('');
    setPwd2('');
    setPwd1Error(false); setPwd2Error(false); setPwdAlert({ show: false, msg: '' });
    setStrengthScore(0); setStrengthVisible(false);
    setReqsMet({ len: false, upper: false, num: false, special: false });
    setScreen('email');
  };

  // ------------------------------
  // Pantalla 1 - Enviar código
  // ------------------------------
  const handleSendCode = async () => {
    const trimmed = email.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    setEmailAlert({ show: false, msg: '' });
    setEmailError(!ok);
    if (!ok) return;

    setLoadingSend(true);
    try {
      await forgotPassword(trimmed);
      setUserEmail(trimmed);
      setScreen('confirm');
      startResendCountdown(600);
      setTimeout(() => otpRefs.current[0]?.focus(), 350);
    } catch (error) {
      setEmailAlert({ show: true, msg: error.message || 'No encontramos una cuenta con ese correo.' });
      setEmailError(true);
    } finally {
      setLoadingSend(false);
    }
  };

  // ------------------------------
  // Pantalla 2 - OTP
  // ------------------------------
  const clearOtpErrors = () => {
    setOtpErrors([false, false, false, false, false, false]);
    setOtpErrMsg(false);
    setCodeAlert({ show: false, msg: '' });
  };

  const handleOtpChange = (idx, val) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    clearOtpErrors();
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const next = [...otp];
      next[idx - 1] = '';
      setOtp(next);
      otpRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft'  && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (e.key === 'Enter') handleVerify();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData)
      .getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    paste.split('').forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(paste.length, 5)]?.focus();
    clearOtpErrors();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setOtpErrors(otp.map(v => !v));
      setOtpErrMsg(true);
      return;
    }

    setLoadingVerify(true);
    try {
      await verifyResetCode({ correo: userEmail, code });
      clearInterval(resendIntervalRef.current);
      setScreen('newpwd');
    } catch (error) {
      setCodeAlert({ show: true, msg: error.message || 'Código incorrecto. Inténtalo de nuevo.' });
      setOtpErrors([true, true, true, true, true, true]);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      return;
    }

    setOtp(['', '', '', '', '', '']);
    clearOtpErrors();
    setVerifyDisabled(true);
    setResendAlert(false);

    try {
      await forgotPassword(userEmail);
      setResendAlert(true);
      setTimeout(() => setResendAlert(false), 4000);
      startResendCountdown(600);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setCodeAlert({ show: true, msg: error.message || 'No se pudo reenviar el código.' });
      setVerifyDisabled(false);
    }
  };

  // ------------------------------
  // Pantalla 3 - Nueva contraseña
  // ------------------------------
  const handlePwd1Change = (val) => {
    setPwd1(val);
    setPwd1Error(false);
    setPwdAlert({ show: false, msg: '' });
    if (val.length === 0) {
      setStrengthVisible(false);
      setStrengthScore(0);
      setReqsMet({ len: false, upper: false, num: false, special: false });
      return;
    }
    setStrengthScore(getStrength(val));
    setStrengthVisible(true);
    setReqsMet({
      len:     val.length >= 8,
      upper:   /[A-Z]/.test(val),
      num:     /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val),
    });
    if (pwd2.length > 0) setPwd2Error(val !== pwd2);
  };

  const handlePwd2Change = (val) => {
    setPwd2(val);
    if (val.length === 0) { setPwd2Error(false); return; }
    setPwd2Error(pwd1 !== val);
  };

  const handleSavePwd = async () => {
    setPwdAlert({ show: false, msg: '' });
    let valid = true;
    if (pwd1.length < 8) { setPwd1Error(true); valid = false; }
    if (!allReqsMet)      { setPwd1Error(true); valid = false; }
    if (!pwd2)            { setPwd2Error(true); valid = false; }
    if (pwd1 !== pwd2)    { setPwd2Error(true); valid = false; }
    if (!valid) return;

    setLoadingSave(true);
    try {
      await resetPassword({ correo: userEmail, code: otp.join(''), new_password: pwd1 });
      setScreen('success');
    } catch (error) {
      setPwdAlert({ show: true, msg: error.message || 'No se pudo restablecer la contraseña.' });
    } finally {
      setLoadingSave(false);
    }
  };

  const allReqsMet = reqsMet.len && reqsMet.upper && reqsMet.num && reqsMet.special;
  const emailOk = email.trim().length > 0 && emailRegex.test(email.trim());
  const otpValue = otp.join('');
  const isSendCodeEnabled = !loadingSend && emailOk;
  const isVerifyEnabled = otpValue.length === 6 && !loadingVerify && !verifyDisabled;
  const isSavePasswordEnabled = !loadingSave && pwd1.length > 0 && pwd2.length > 0 && allReqsMet && pwd1 === pwd2;

  // ======================================================
  // Renderizado
  // ======================================================

  return (
    <div className="rp-wrap">
      <BgPattern />

      <div className="rp-card">

        {/* ======================================================
            Logo
        ====================================================== */}
        <AuthLogo
          containerClassName="rp-logo"
          markClassName="rp-logo-mark"
          textClassName="rp-logo-name"
        />

        {/* ======================================================
            Pantalla 1 - Email
        ====================================================== */}
        {screen === 'email' && (
          <div className="rp-screen">
            <ProgressDots step={1} />

            {/* Icono de pantalla */}
            <div className="rp-screen-icon">
              <IconLock />
            </div>

            {/* Encabezado */}
            <div className="rp-header">
              <h1>Recuperar contraseña</h1>
              <p>Ingresa tu correo y te enviaremos un código de verificación para restablecer tu contraseña.</p>
            </div>

            {/* Alerta de error */}
            {emailAlert.show && (
              <div className="rp-alert rp-alert--danger">
                <IconAlertCircle />
                <span>{emailAlert.msg}</span>
              </div>
            )}

            {/* Campo de correo electrónico */}
            <div className="rp-fields">
              <div className="rp-field">
                <label htmlFor="recover-email">Correo electrónico</label>
                <div className="rp-input-wrap">
                  <input
                    id="recover-email"
                    className={`rp-input${emailError ? ' error' : ''}`}
                    type="email"
                    placeholder="tu@empresa.com"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setEmailError(false);
                      setEmailAlert({ show: false, msg: '' });
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                  />
                </div>
                {emailError && (
                  <span className="rp-error-msg">Ingresa un correo válido</span>
                )}
              </div>
            </div>

            {/* Botón de envío */}
            <button
              className={`rp-btn-main${loadingSend ? ' loading' : ''}`}
              onClick={handleSendCode}
              disabled={!isSendCodeEnabled}
            >
              <span className="rp-spinner" />
              <span className="rp-btn-label">Enviar código de verificación</span>
            </button>

            {/* Botón de volver */}
            <button className="rp-btn-ghost" onClick={() => navigate('/')}>
              Volver al inicio de sesión
            </button>
          </div>
        )}

        {/* ======================================================
            Pantalla 2 - OTP
        ====================================================== */}
        {screen === 'confirm' && (
          <div className="rp-screen">
            <ProgressDots step={2} />

            {/* Icono de pantalla */}
            <div className="rp-screen-icon">
              <IconMail />
            </div>

            {/* Encabezado */}
            <div className="rp-header">
              <h1>Revisa tu correo</h1>
              <p>Enviamos un código de <strong>6 dígitos</strong> a</p>
              <div className="rp-email-badge">
                <IconMail />
                <span>{userEmail}</span>
              </div>
              <p>
                El código expirará en{' '}
                <strong style={{
                  color: expireExpired ? 'rgba(180,20,20,0.80)' : 'rgba(0,8,44,0.65)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {expireText}
                </strong>
                {' '}· Revisa también tu carpeta de spam.
              </p>
            </div>

            {/* Alertas */}
            {codeAlert.show && (
              <div className="rp-alert rp-alert--danger">
                <IconAlertCircle />
                <span>{codeAlert.msg}</span>
              </div>
            )}
            {resendAlert && (
              <div className="rp-alert rp-alert--success">
                <IconCheckmark />
                <span>Código reenviado. Revisa tu bandeja de entrada.</span>
              </div>
            )}

            {/* Campo de código OTP */}
            <div className="rp-field">
              <label>Código de verificación</label>
              <div className="rp-otp-wrap">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (otpRefs.current[idx] = el)}
                    className={`rp-otp-input${otpErrors[idx] ? ' error' : ''}${digit ? ' filled' : ''}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    autoComplete={idx === 0 ? 'one-time-code' : undefined}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    onFocus={e => e.target.select()}
                  />
                ))}
              </div>
              {otpErrMsg && (
                <span className="rp-error-msg" style={{ textAlign: 'center' }}>
                  Ingresa los 6 dígitos del código
                </span>
              )}
            </div>

            {/* Botón de verificación */}
            <button
              className={`rp-btn-main${loadingVerify ? ' loading' : ''}`}
              onClick={handleVerify}
              disabled={!isVerifyEnabled}
            >
              <span className="rp-spinner" />
              <span className="rp-btn-label">Verificar código</span>
            </button>

            {/* Opción de reenviar */}
            <div className="rp-resend-row">
              ¿No llegó?{' '}
              <button onClick={handleResend} disabled={resendDisabled}>
                Reenviar código
              </button>
              {resendCountdown > 0 && resendDisabled && (
                <span className="rp-countdown"> ({resendCountdown}s)</span>
              )}
            </div>

            {/* Botón de cancelar */}
            <button className="rp-btn-ghost" onClick={resetAll}>
              Usar otro correo
            </button>
          </div>
        )}

        {/* ======================================================
            Pantalla 3 - Nueva contraseña
        ====================================================== */}
        {screen === 'newpwd' && (
          <div className="rp-screen">
            <ProgressDots step={3} />

            {/* Icono de pantalla */}
            <div className="rp-screen-icon">
              <IconShield />
            </div>

            {/* Encabezado */}
            <div className="rp-header">
              <h1>Nueva contraseña</h1>
              <p>Elige una contraseña segura que no hayas usado antes.</p>
            </div>

            {/* Alerta de error */}
            {pwdAlert.show && (
              <div className="rp-alert rp-alert--danger">
                <IconAlertCircle />
                <span>{pwdAlert.msg}</span>
              </div>
            )}

            {/* Campos de contraseña */}
            <div className="rp-fields">
              {/* Campo de nueva contraseña */}
              <div className="rp-field">
                <label htmlFor="recover-new-password">Nueva contraseña</label>
                <PasswordField
                  id="recover-new-password"
                  className={`rp-input rp-input--has-icon${pwd1Error ? ' error' : ''}`}
                  wrapperClassName="rp-input-wrap"
                  buttonClassName="rp-eye-btn"
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  value={pwd1}
                  onChange={e => handlePwd1Change(e.target.value)}
                />
                {pwd1Error && (
                  <span className="rp-error-msg">Mínimo 8 caracteres</span>
                )}

                {/* Indicador de fortaleza */}
                {strengthVisible && (
                  <>
                    <div className="rp-strength-bar">
                      {[0, 1, 2, 3].map(i => (
                        <div
                          key={i}
                          className={`rp-strength-seg${i < strengthScore ? ' ' + STRENGTH_CLASSES[strengthScore] : ''}`}
                        />
                      ))}
                    </div>
                    <div className="rp-strength-label">
                      {STRENGTH_LABELS[strengthScore]}
                    </div>
                  </>
                )}

                {/* Requisitos de contraseña */}
                {strengthVisible && !allReqsMet && (
                  <div className="rp-pwd-reqs">
                    {!reqsMet.len && (
                      <div className="rp-req-item">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        Mínimo 8 caracteres
                      </div>
                    )}
                    {!reqsMet.upper && (
                      <div className="rp-req-item">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        Una letra mayúscula
                      </div>
                    )}
                    {!reqsMet.num && (
                      <div className="rp-req-item">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        Un número
                      </div>
                    )}
                    {!reqsMet.special && (
                      <div className="rp-req-item">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        Un carácter especial (!@#$...)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Campo de confirmar contraseña */}
              <div className="rp-field">
                <label htmlFor="recover-confirm-password">Confirmar contraseña</label>
                <PasswordField
                  id="recover-confirm-password"
                  className={`rp-input rp-input--has-icon${
                    pwd2Error ? ' error' : pwd2.length > 0 && pwd1 === pwd2 ? ' valid' : ''
                  }`}
                  wrapperClassName="rp-input-wrap"
                  buttonClassName="rp-eye-btn"
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  value={pwd2}
                  onChange={e => handlePwd2Change(e.target.value)}
                />
                {pwd2Error && (
                  <span className="rp-error-msg">Las contraseñas no coinciden</span>
                )}
              </div>
            </div>

            <button
              className={`rp-btn-main${loadingSave ? ' loading' : ''}`}
              onClick={handleSavePwd}
              disabled={!isSavePasswordEnabled}
            >
              <span className="rp-spinner" />
              <span className="rp-btn-label">Guardar nueva contraseña</span>
            </button>

            {/* Botón de cancelar */}
            <button className="rp-btn-ghost" onClick={resetAll}>
              Cancelar
            </button>
          </div>
        )}

        {/* ======================================================
            Pantalla 4 - Éxito
        ====================================================== */}
        {screen === 'success' && (
          <div className="rp-screen">
            <div className="rp-progress-dots" style={{ opacity: 0, pointerEvents: 'none' }}>
              <div className="rp-dot done" />
              <div className="rp-dot done" />
              <div className="rp-dot done" style={{ background: '#10A060' }} />
            </div>

            {/* Icono de éxito */}
            <div className="rp-success-icon">
              <IconCheck />
            </div>

            {/* Encabezado */}
            <div className="rp-header">
              <h1>Contraseña actualizada</h1>
              <p>Tu contraseña fue cambiada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.</p>
            </div>

            {/* Botón de ir al login */}
            <button className="rp-btn-main" onClick={() => navigate('/')}>
              <span className="rp-btn-label">Ir al inicio de sesión</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
