import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase/firebase';
import { ref, set, get } from 'firebase/database';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthTabs({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();

  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  const adminEmails = ['admin@gmail.com', 'supervisor@empresa.com'];

  async function handleLogin(e) {
    e.preventDefault();

    if (!validarEmail(email)) {
      setError('El correo no es válido');
      return;
    }
    if (!password.trim()) {
      setError('La contraseña es obligatoria');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const snapshot = await get(ref(database, 'usuarios/' + user.uid));
      const data = snapshot.exists() ? snapshot.val() : {};
      const isAdmin = adminEmails.includes(user.email); 
      setShowWelcomeModal(true); // Mostrar modal de bienvenida
      const userData = {
      email: user.email,
      id: user.uid,
      nombre: data.nombre || 'Usuario',
      isAdmin: isAdmin
    };

    localStorage.setItem('user', JSON.stringify(userData));

    setShowWelcomeModal(true);

      setTimeout(() => {
      onLogin(userData);
      navigate(isAdmin ? '/admin' : '/dashboard'); 
    }, 2000);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos');
      } else {
        setError('Error al iniciar sesión: ' + err.message);
      }
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!validarEmail(email)) {
      setError('El correo no es válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, 'usuarios/' + user.uid), {
        nombre,
        email
      });

      alert('¡Registro exitoso! Inicia sesión ahora');
      setActiveTab('login');
      setError('');
      setEmail('');
      setPassword('');
      setNombre('');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado');
      } else {
        setError('Error al registrarse: ' + err.message);
      }
    }
  }

  return (
    <div className="relative">
    
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-green-600">¡Bienvenido al sistema!</h2>
            <p className="text-gray-700">Estamos cargando tu información...</p>
          </div>
        </div>
      )}

      
      <div className="max-w-md mx-auto mt-10 p-6 border-spacing-4 rounded-3xl shadow-2xl bg-white">
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 font-semibold ${activeTab === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 font-semibold ${activeTab === 'register' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Registrarse
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <input
              className="w-full p-2 mb-4 border rounded-xl border-gray-300"
              type="email"
              placeholder="Correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full p-2 mb-4 border rounded-xl border-gray-300"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 w-full rounded-xl">
              Iniciar sesión
            </button>
          </form>
        )}


        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            <input
              className="w-full p-2 mb-4 border rounded-xl border-gray-300"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
            <input
              className="w-full p-2 mb-4 border rounded-xl border-gray-300"
              type="email"
              placeholder="Correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full p-2 mb-4 border rounded-xl border-gray-300"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 w-full rounded-xl">
              Registrarse
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
