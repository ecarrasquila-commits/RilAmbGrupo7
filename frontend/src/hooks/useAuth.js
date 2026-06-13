import { useState, useCallback } from "react";
import { getRole, getToken, logout } from "../services/authService";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [role, setRole] = useState(getRole());

  const logoutUser = useCallback(() => {
    logout();
    setIsAuthenticated(false);
    setRole(null);
  }, []);

  return { isAuthenticated, role, logoutUser };
}
