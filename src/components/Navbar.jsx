import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Revisamos si hay usuario guardado
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al cargar usuario:", e);
      }
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      {/* Logo y título */}
      <div className="flex items-center space-x-2">
        <span className="font-bold text-xl">BiciSmart</span>
      </div>

      {/* Parte derecha del navbar */}
      <div className="flex items-center space-x-4">
        <img src="/ruta-del-logo.png" alt="Logo BiciSmart" className="h-8 w-8" />

        {user && (
          <>
            <span className="font-semibold">👤 {user.nombre}</span>
            <Link to="/perfil" className="hover:underline">Perfil</Link>
            <Link to="/historial" className="hover:underline">Historial</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
