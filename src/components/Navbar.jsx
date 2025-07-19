import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white  flex justify-between items-center shadow-md p-4">

      <div className="text-xl font-bold flex items-center gap-2">
        <img src="../src/assets/logo-bici.jpg" alt="Logo" className="h-16 w-16" />
        <span className=''>BiciSmart</span>
      </div>

  
      {user && (
        <div className="flex items-center gap-4">
          <img src="../src/assets/imagen2.webp" alt="Logo" className="h-8 w-8 rounded-xl " />
          {/* MOSTRAR HOLA, Y NOMBRE DE QQUE SE LOGEO, ABRIR VENTANA DE PERFIL MOSTRANDO CORREO Y NOMBRE Y PARA SUBIR IMAGEN*/}
          <a>Hola, <strong>{user.name}</strong></a>   
          {/*  */}
          <a href="/historial" className="hover:underline">Historial</a>
          {/*  */}

          
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
