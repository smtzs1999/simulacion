import React from 'react';

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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


function App() {
  const [usuario, setUsuario] = useState(null);
  const [viajeActivo, setViajeActivo] = useState(false);
  // const [historial, setHistorial] = useState([]);
  const [viajeEnCurso, setViajeEnCurso] = useState(null);
  const [historial, setHistorial] = React.useState(() => {
    const saved = localStorage.getItem('historialViajes');
    return saved ? JSON.parse(saved) : [];
  });
  React.useEffect(() => {
    localStorage.setItem('historialViajes', JSON.stringify(historial));
  }, [historial]);

  function handleLogin(user) {
    setUsuario(user);
  }

  function handleRegister(user) {
    setUsuario(user);
  }

  function handleLogout() {
    setUsuario(null);
    setViajeActivo(false);
    setHistorial([]);
  }

  function iniciarViaje(estacion) {
  setViajeActivo(true);
  setViajeEnCurso(estacion); 
  setHistorial((v) => [
    ...v,
    {
      estacion: estacion,
      duracion: "En curso",
      fecha: new Date().toLocaleString(),
      inicio: Date.now(),
    },
  ]);
}


  function terminarViaje(estacion) {
  setViajeActivo(false);
  setViajeEnCurso(null); // ← Limpiamos viaje activo
  setHistorial((v) => {
    const copia = [...v];
    const ultimo = copia[copia.length - 1];
    if (ultimo && ultimo.duracion === "En curso") {
      const duracion = Math.floor((Date.now() - ultimo.inicio) / 1000);
      const minutos = Math.floor(duracion / 60);
      const segundos = duracion % 60;
      ultimo.duracion = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
    return copia;
  });
}

  return (
    <Router>
      <Navbar user={usuario} onLogout={handleLogout} historial={historial} />
      <Routes>
      
        <Route path="/login" element={!usuario ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/registro" element={!usuario ? <Registro onRegister={handleRegister} /> : <Navigate to="/" />} />

     
        <Route
          path="/admin"
          element={
            usuario?.isAdmin ? (
              <DashboardAdmin />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

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
                historial={historial} setHistorial={setHistorial}
              />


                <Temporizador activo={viajeActivo} onStop={terminarViaje} />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/historial"
          element={Historial ? <Historial viajes={historial} /> : <Navigate to="/login" />}
        />
        <Route
          path="/perfil"
          element={usuario ? <Perfil usuario={usuario} /> : <Navigate to="/login" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
