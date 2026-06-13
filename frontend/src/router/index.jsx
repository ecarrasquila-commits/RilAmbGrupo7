// frontend/src/router/index.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Login from "../pages/authentication/login";
import RecoverPassword from "../pages/authentication/recoverPassword";
import Register from "../pages/authentication/register";
import SessionLogo from "../pages/authentication/sessionLogo";
import Home from "../pages/home";
import UserMonitoring from "../pages/user/userMonitoring";
import UserReports from "../pages/user/userReports";
import UserDevices from "../pages/user/userDevices";
import UserPerfil from "../pages/user/userPerfil";
import AdminReports from "../pages/admin/adminReports";
import AdminUser from "../pages/admin/adminUser";
import AdminDevices from "../pages/admin/adminDevices";
import AdminPerfil from "../pages/admin/adminPerfil";

// Componentes
import ProtectedRoute from "../components/ProtectedRoute";


// ======================================================
// Enrutador de la aplicación
// Maneja todas las rutas de la app.
// ======================================================

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/session-logo" element={<SessionLogo />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDevices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserPerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/devices"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDevices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPerfil />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}