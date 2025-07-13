export default function Perfil({ usuario }) {
  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="max-w-sm mx-auto mt-6 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil de usuario</h2>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      {/* Aquí puedes agregar más datos si quieres */}
    </div>
  );
}
