import { useState } from 'react';

export default function Registro({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // Simular registro
    if(email && password) {
      onRegister({ email, id: 2, nombre: 'Nuevo Usuario' });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 font-bold">Registro</h2>
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
  );
}
