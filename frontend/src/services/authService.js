const API_URL = "http://127.0.0.1:8000/auth";

async function handleResponse(response, fallbackMessage) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || fallbackMessage || "Error en la solicitud");
  }
  return result;
}

export async function registerUser(data) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response, "Error al registrar");
}

export async function loginUser(data) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse(response, "Error login");

  localStorage.setItem("token", result.access_token);
  localStorage.setItem("role", result.rol || "user");

  return result;
}

export async function forgotPassword(correo) {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo }),
  });

  return handleResponse(response, "Error al enviar el código de recuperación");
}

export async function verifyResetCode(data) {
  const response = await fetch(`${API_URL}/verify-reset-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response, "Error al verificar el código");
}

export async function resetPassword(data) {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response, "Error al restablecer la contraseña");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}
