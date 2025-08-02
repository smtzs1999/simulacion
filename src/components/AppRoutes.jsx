// AppRoutes.jsx
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Login from "./components/Login";
import Registro from "./components/Registro";
import MapaEstaciones from "./components/MapaEstaciones";
import ListaBicicletas from "./components/ListaBicicletas";
import Temporizador from "./components/Temporizador";
import Historial from "./components/Historial";
import Perfil from "./components/Perfil";
import Navbar from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import DashboardAdmin from "./components/DashboardAdmin";

export default function AppRoutes({ usuario, onLogin, onRegister, onLogout, iniciarViaje, terminarViaje, viajeActivo, viajeEnCurso, historial, setHistorial }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      if (usuario.isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [usuario]);

  return (
    <>
      <Navbar user={usuario} onLogout={onLogout} historial={historial} />
      <Routes>
        <Route path="/login" element={!usuario ? <Login onLogin={onLogin} /> : <Navigate to="/" />} />
        <Route path="/registro" element={!usuario ? <Registro onRegister={onRegister} /> : <Navigate to="/" />} />
        
        <Route path="/admin" element={usuario?.isAdmin ? <DashboardAdmin /> : <Navigate to="/" replace />} />

        <Route
          path="/"
          element={
            usuario ? (
              <div className="p-4 space-y-4">
                <Dashboard />
                <MapaEstaciones />
                <ListaBicicletas
                  onAlquilar={iniciarViaje}
                  onDevolver={terminarViaje}
                  viajeActivo={viajeActivo}
                  viajeEnCurso={viajeEnCurso}
                  historial={historial}
                  setHistorial={setHistorial}
                />
                <Temporizador activo={viajeActivo} onStop={terminarViaje} />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/historial" element={usuario ? <Historial viajes={historial} /> : <Navigate to="/login" />} />
        <Route path="/perfil" element={usuario ? <Perfil usuario={usuario} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
