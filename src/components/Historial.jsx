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
import Navbar from "./Navbar";
// export default Historial;
const HistorialDeViajes = ({ historial = [] }) => {
  if (!historial.length) {
    return <p className="text-gray-500 text-center">Aún no has realizado ningún viaje.</p>;
  }

  return (
    <ul className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
      {historial.map((viaje, index) => (
        <li key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <p><strong>Inicio:</strong> {viaje.inicio || viaje.estacion || "Desconocido"}</p>
          <p><strong>Destino:</strong> {viaje.destino || "-"}</p>
          <p><strong>Duración:</strong> {viaje.duracion || "No disponible"}</p>
          <p className="text-sm text-gray-400">{viaje.fecha || "Fecha no disponible"}</p>
        </li>
      ))}
    </ul>
  );
};

export default HistorialDeViajes;
