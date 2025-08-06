import React, { useState, useEffect, useRef  } from 'react';
import { Camera } from 'lucide-react'; 
import HistorialDeViajes from './Historial';



const Navbar = ({ user, onLogout, historial }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [profileImage, setProfileImage] = useState('../src/assets/imagen2.webp'); 
  const [showHistorial, setShowHistorial] = useState(false);
  const menuRef = useRef(null);
const historialRef = useRef(null);


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
useEffect(() => {
  function handleClickOutside(event) {
    if (
      menuRef.current && !menuRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }

    if (
      historialRef.current && !historialRef.current.contains(event.target)
    ) {
      setShowHistorial(false);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <nav className="bg-blue-100 text-gray-800 flex justify-between items-center shadow-md px-8 py-6 font-semibold"> 
      <div className="text-4xl font-bold flex items-center gap-6">
        <img src="../src/assets/biciS.jpeg" alt="Logo" className="h-20 w-20 rounded-full shadow-lg" />
        <span className="text-blue-700">BiciSmart</span>
      </div>

      {user && (
        <div className="relative flex items-center gap-8">
          <span className="text-xl">Hola, <strong>{user.nombre}</strong></span>

          <div className="relative">
            <button
              onClick={() => setShowHistorial(!showHistorial)}
              className="text-blue-700 hover:underline text-xl"
            >
              Historial
            </button>

            {/* Panel desplegable */}
            {showHistorial && (
  <div
    ref={historialRef}
    className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4"
  >
    <h3 className="text-lg font-semibold mb-3 text-center">Historial de Viajes</h3>
    <HistorialDeViajes historial={historial} />
  </div>
)}

          </div>
        

          <div className="relative">
            <img
              src={profileImage}
              alt="Avatar"
              className="h-14 w-14 rounded-full cursor-pointer border-4 border-blue-300"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
  <div
    ref={menuRef}
    className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border z-20 p-8 text-center animate-fade-in"
  >
                <div className="flex justify-center">
                  <img
                    src={profileImage}
                    alt="Perfil"
                    className="h-28 w-28 rounded-full border-4 border-blue-300 object-cover"
                  />
                </div>

                <h3 className="text-2xl font-semibold mt-5">{user.nombre}</h3>
                <p className="text-lg text-gray-500 break-words">{user.email || user.correo}</p>

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

                <div className="mt-5 flex justify-center">
                  <Camera className="text-blue-500 w-8 h-8" />
                </div>

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
