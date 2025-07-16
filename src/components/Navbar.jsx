import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">

      <div className="text-xl font-bold flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span>Mi Aplicación</span>
      </div>

  
      {user && (
        <div className="flex items-center gap-4">
          <span>Hola, <strong>{user.name}</strong></span>
          <a href="/historial" className="hover:underline">Historial</a>
          <button 
            onClick={onLogout} 
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
