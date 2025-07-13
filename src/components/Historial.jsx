export default function Historial({ viajes }) {
  if (!viajes.length) {
    return <p className="text-center mt-10 text-gray-600">No hay viajes realizados aún.</p>;
  }
  return (
    <div className="max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Historial de viajes</h2>
      <ul className="space-y-2">
        {viajes.map((viaje, i) => (
          <li key={i} className="border p-3 rounded shadow">
            <p><strong>Estación:</strong> {viaje.estacion}</p>
            <p><strong>Duración:</strong> {viaje.duracion}</p>
            <p><strong>Fecha:</strong> {viaje.fecha}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
