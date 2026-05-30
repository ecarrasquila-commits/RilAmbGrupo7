const API_URL = "http://127.0.0.1:8000/auth";

export async function registerUser(data) {

  const response = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Error al registrar"
    );
  }

  return result;
}

export async function loginUser(data) {

  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Error login"
    );
  }

  localStorage.setItem(
    "token",
    result.access_token
  );

  return result;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
