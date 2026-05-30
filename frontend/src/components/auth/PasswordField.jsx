// frontend/src/components/auth/PasswordField.jsx

import { useState } from "react";

import { EyeOpen, EyeClosed } from "./passwordEye";

export default function PasswordField({
  id,
  className = "",
  wrapperClassName = "",
  buttonClassName = "",
  placeholder = "",
  autoComplete = "current-password",
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={wrapperClassName}>
      <input
        id={id}
        className={className}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
      />

      <button
        type="button"
        className={`${buttonClassName}${
          value?.length > 0 ? " visible" : ""
        }`}
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={
          showPassword
            ? "Ocultar contraseña"
            : "Mostrar contraseña"
        }
      >
        {showPassword ? <EyeClosed /> : <EyeOpen />}
      </button>
    </div>
  );
}