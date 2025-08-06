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
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const ListaBicicletas = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const db = getDatabase();
        const historialRef = ref(db, `historial_viajes/${user.uid}`);
        onValue(historialRef, (snapshot) => {
          const data = snapshot.val();
          if (data) setHistorial(Object.values(data));
          else setHistorial([]);
        });
      } else {
        setHistorial([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Historial de viajes</h2>
      {historial.length === 0 ? (
        <p>No tienes viajes guardados.</p>
      ) : (
        <ul>
          {historial.map((viaje, i) => (
            <li key={i}>
              <p><strong>Inicio:</strong> {viaje.estacionInicio || viaje.inicio}</p>
              <p><strong>Destino:</strong> {viaje.estacionFin || viaje.destino || '-'}</p>
              <p><strong>Duración:</strong> {viaje.duracion}</p>
              <p><small>{new Date(viaje.fecha).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaBicicletas;
