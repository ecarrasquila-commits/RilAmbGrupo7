const API_URL = "http://127.0.0.1:8000";

async function handleResponse(response, fallbackMessage) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || fallbackMessage || "Error en la solicitud");
  }
  return result;
}

export async function getMyDevices() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/devices/my-devices`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al obtener dispositivos");
}

export async function linkDevice(pairingCode, alias = null) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/devices/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      pairing_code: pairingCode,
      alias: alias
    }),
  });

  return handleResponse(response, "Error al vincular dispositivo");
}

export async function unlinkDevice(deviceId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/devices/unlink/${deviceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al desvincular dispositivo");
}

export async function getSensorData() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/devices/sensor-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al obtener datos de sensores");
}

export async function getSensorHistory(limit = 30) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/devices/sensor-history?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al obtener historial de sensores");
}

export async function getReportSummary() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_URL}/devices/report-summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Error al obtener resumen del reporte");
}
