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
  const navigate = useNavigate();

  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

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

      alert('¡Bienvenido al sistema!');
      onLogin({ email: user.email, id: user.uid, nombre: data.nombre || 'Usuario' });
      navigate('/dashboard');
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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
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
            className="w-full p-2 mb-4 border rounded"
            type="email"
            placeholder="Correo"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 mb-4 border rounded"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
            Iniciar sesión
          </button>
        </form>
      )}

      {activeTab === 'register' && (
        <form onSubmit={handleRegister}>
          <input
            className="w-full p-2 mb-4 border rounded"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <input
            className="w-full p-2 mb-4 border rounded"
            type="email"
            placeholder="Correo"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 mb-4 border rounded"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
            Registrarse
          </button>
        </form>
      )}
    </div>
  );
}
