import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DashboardPage } from '../pages/DashboardPage'
import { OperarioPage } from '../pages/OperarioPage'
import { ProtectedRoute } from '../components/protected/ProtectedRoute';
export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Ruta protegida para Administrador */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para Operario */}
        <Route
          path="/operario"
          element={
            <ProtectedRoute allowedRole="operario">
              <OperarioPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};