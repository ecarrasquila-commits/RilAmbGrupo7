const API_URL = "http://127.0.0.1:8000";

async function handleResponse(response, fallbackMessage) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || fallbackMessage || "Error en la solicitud");
  }
  return result;
}

export async function getUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al obtener perfil de usuario");
}

export async function updateUserProfile(data) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response, "Error al actualizar perfil de usuario");
}

export async function getUserNotifications(limit = 20) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/users/me/notifications?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al obtener notificaciones");
}

export async function markUserNotificationAsRead(notificationId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/users/me/notifications/${notificationId}/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al marcar notificación como leída");
}

export async function markAllUserNotificationsAsRead() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/users/me/notifications/read-all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al marcar notificaciones como leídas");
}
