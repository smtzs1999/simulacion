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

function App() {
  const [usuario, setUsuario] = useState(null);
  const [viajeActivo, setViajeActivo] = useState(false);
  const [historial, setHistorial] = useState([]);

  function handleLogin(user) {
    setUsuario(user);
  }

  function handleRegister(user) {
    setUsuario(user);
  }

  function iniciarViaje(idBici) {
    setViajeActivo(true);
    setHistorial(v => [...v, {
      estacion: "Estación Demo",
      duracion: "En curso",
      fecha: new Date().toLocaleString(),
    }]);
  }

  function terminarViaje() {
    setViajeActivo(false);
    setHistorial(v => {
      const copia = [...v];
      const ultimo = copia[copia.length - 1];
      if (ultimo) ultimo.duracion = "00:05:23"; // Duración simulada
      return copia;
    });
  }

  if (!usuario) {
    return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/registro" element={<Registro onRegister={handleRegister} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Dashboard/>
              <MapaEstaciones />
              <ListaBicicletas onAlquilar={iniciarViaje} />
              <Temporizador activo={viajeActivo} onStop={terminarViaje} />
            </>
          }
        />
        <Route path="/historial" element={<Historial viajes={historial} />} />
        <Route path="/perfil" element={<Perfil usuario={usuario} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );m
}

export default App;
