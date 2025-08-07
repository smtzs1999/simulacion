import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "./firebase/firebase";

import Login from "./components/Login";
import ListaBicicletas from "./components/ListaBicicletas";
import Temporizador from "./components/Temporizador";
import Historial from "./components/Historial";
import Perfil from "./components/Perfil";
import Navbar from "./components/Navbar";
import DashboardAdmin from "./components/DashboardAdmin";
import 'sweetalert2/dist/sweetalert2.min.css';


function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [viajeActivo, setViajeActivo] = useState(false);
  const [viajeEnCurso, setViajeEnCurso] = useState(null);
  const [cargando, setCargando] = useState(true); // <- IMPORTANTE
  const [historial, setHistorial] = useState(() => {
    const saved = localStorage.getItem("historialViajes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("historialViajes", JSON.stringify(historial));
  }, [historial]);

  function handleLogin(user) {
    setUsuario(user);
  }

  function handleLogout() {
    setUsuario(null);
    setViajeActivo(false);
    setHistorial([]);
    localStorage.removeItem("user");
    auth.signOut(); // <- cerrar sesión de Firebase
    navigate("/login");
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
    setViajeEnCurso(null);
    setHistorial((v) => {
      const copia = [...v];
      const ultimo = copia[copia.length - 1];
      if (ultimo && ultimo.duracion === "En curso") {
        const duracion = Math.floor((Date.now() - ultimo.inicio) / 1000);
        const minutos = Math.floor(duracion / 60);
        const segundos = duracion % 60;
        ultimo.duracion = `${minutos.toString().padStart(2, "0")}:${segundos
          .toString()
          .padStart(2, "0")}`;
      }
      return copia;
    });
  }

  // 🔥 Mantener sesión activa usando Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snapshot = await get(ref(database, "usuarios/" + user.uid));
          const data = snapshot.exists() ? snapshot.val() : {};

          const emailKey = user.email.replace(/\./g, ",");
          const adminSnapshot = await get(ref(database, "administradores/" + emailKey));
          const isAdmin = adminSnapshot.exists() && adminSnapshot.val() === true;

          const userData = {
            email: user.email,
            id: user.uid,
            nombre: data.nombre || "Usuario",
            isAdmin: isAdmin,
          };

          localStorage.setItem("user", JSON.stringify(userData));
          setUsuario(userData);
        } catch (err) {
          console.error("Error al recuperar datos del usuario:", err);
          setUsuario(null);
        }
      } else {
        setUsuario(null);
        localStorage.removeItem("user");
      }

      setCargando(false); // <- solo cuando ya revisaste sesión
    });

    return () => unsubscribe();
  }, []);

  // 🔁 Redirección automática según tipo de usuario
  useEffect(() => {
    if (!cargando && usuario) {
      if (usuario.isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [usuario, cargando]);

  // Mientras carga la sesión
  if (cargando) return <div className="p-6 text-center">Cargando sesión...</div>;

  return (
    <>
      <Navbar user={usuario} onLogout={handleLogout} historial={historial} />
      <Routes>
        <Route
          path="/login"
          element={!usuario ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
        />

        <Route
          path="/admin"
          element={
            usuario?.isAdmin ? <DashboardAdmin /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/"
          element={
            usuario ? (
              <>
                <ListaBicicletas
                  onAlquilar={iniciarViaje}
                  onDevolver={terminarViaje}
                  viajeActivo={viajeActivo}
                  viajeEnCurso={viajeEnCurso}
                />
                <Temporizador activo={viajeActivo} onStop={terminarViaje} />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/historial"
          element={
            usuario ? <Historial viajes={historial} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/perfil"
          element={
            usuario ? <Perfil usuario={usuario} /> : <Navigate to="/login" />
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
