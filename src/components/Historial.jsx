const Historial = ({ viajes }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Historial de Viajes</h2>
      {viajes.length === 0 ? (
        <p className="text-gray-600">No hay viajes registrados.</p>
      ) : (
        <ul className="space-y-2">
          {viajes.map((viaje, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-md shadow border border-gray-200"
            >
              <p><strong>Estación:</strong> {viaje.estacion}</p>
              <p><strong>Duración:</strong> {viaje.duracion}</p>
              <p><strong>Fecha:</strong> {viaje.fecha}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historial;
