// const Historial = ({ viajes }) => {
//   return (
//     <div className="p-4 bg-gray-100 rounded-md shadow-md">
//       <h2 className="text-xl font-bold mb-4">Historial de Viajes</h2>
//       {viajes.length === 0 ? (
//         <p className="text-gray-600">No hay viajes registrados.</p>
//       ) : (
//         <ul className="space-y-2">
//           {viajes.map((viaje, index) => (
//             <li
//               key={index}
//               className="bg-white p-4 rounded-md shadow border border-gray-200"
//             >
//               <p><strong>Estación:</strong> {viaje.estacion}</p>
//               <p><strong>Duración:</strong> {viaje.duracion}</p>
//               <p><strong>Fecha:</strong> {viaje.fecha}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Historial;

import React, { useState, useEffect } from 'react';

const HistorialDeViajes = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const viajesGuardados = localStorage.getItem('historialViajes');
    if (viajesGuardados) {
      setHistorial(JSON.parse(viajesGuardados));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <h2 className="text-2xl font-semibold mb-4">Historial de Viajes</h2>
      {historial.length === 0 ? (
        <p className="text-gray-600">Aún no has realizado ningún viaje.</p>
      ) : (
        <ul className="space-y-4">
          {historial.map((viaje, index) => (
            <li key={index} className="border p-4 rounded-lg shadow">
              <p><span className="font-semibold">Inicio:</span> {viaje.inicio}</p>
              <p><span className="font-semibold">Destino:</span> {viaje.destino}</p>
              <p><span className="font-semibold">Duración:</span> {viaje.duracion}</p>
              <p><span className="text-sm text-gray-500">{viaje.fecha}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialDeViajes;

