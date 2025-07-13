import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div className="font-bold text-xl">BiciSmart</div>
      <div className="space-x-4">
        <Link to="/">Inicio</Link>
        <Link to="/historial">Historial</Link>
        <Link to="/perfil">Perfil</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
