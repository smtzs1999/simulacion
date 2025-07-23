import React, { useState } from 'react';
import { Camera } from 'lucide-react'; // Asegúrate de tenerlo instalado: npm i lucide-react

const Navbar = ({ user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [profileImage, setProfileImage] = useState('../src/assets/imagen2.webp'); // Imagen inicial

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className="bg-blue-100 text-gray-800 flex justify-between items-center shadow-md px-8 py-6"> 
      {/* Aumenté el padding vertical a py-6 y horizontal a px-8 */}

      {/* Logo + Nombre */}
      <div className="text-4xl font-bold flex items-center gap-6">
        <img src="../src/assets/biciS.jpeg" alt="Logo" className="h-20 w-20 rounded-full shadow-lg" />
        <span className="text-blue-700">BiciSmart</span>
      </div>


      {/* Usuario logeado */}
      {user && (
        <div className="relative flex items-center gap-8">
          <span className="text-xl">Hola, <strong>{user.nombre}</strong></span>

          <a href="/historial" className="text-blue-700 hover:underline text-xl">Historial</a>

          {/* Imagen de perfil con menú */}
          <div className="relative">
            <img
              src={profileImage}
              alt="Avatar"
              className="h-14 w-14 rounded-full cursor-pointer border-4 border-blue-300"
              onClick={() => setShowMenu(!showMenu)}
            />

            {/* Menú desplegable */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border z-20 p-8 text-center animate-fade-in">
                {/* Foto redonda grande */}
                <div className="flex justify-center">
                  <img
                    src={profileImage}
                    alt="Perfil"
                    className="h-28 w-28 rounded-full border-4 border-blue-300 object-cover"
                  />
                </div>

                {/* Nombre y correo */}
                <h3 className="text-2xl font-semibold mt-5">{user.nombre}</h3>
                <p className="text-lg text-gray-500 break-words">{user.email || user.correo}</p>

                {/* Subir nueva imagen (sin botón, se carga automáticamente) */}
                <div className="mt-6">
                  <label className="text-lg text-gray-600 block mb-2 cursor-pointer">
                    Cambiar imagen
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </label>
                </div>

                {/* Ícono de cámara */}
                <div className="mt-5 flex justify-center">
                  <Camera className="text-blue-500 w-8 h-8" />
                </div>

                {/* Botón de cerrar sesión */}
                <button
                  onClick={onLogout}
                  className="mt-8 w-full bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded text-lg transition-all"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
