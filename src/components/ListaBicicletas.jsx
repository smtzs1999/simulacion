// import { useState, useEffect } from 'react';
// import { XCircle, Timer, CheckCircle } from 'lucide-react';

// const bicicletasFake = [
//   { id: 1, nombre: 'Bici A', estado: 'libre', tiempo: 0 },
//   { id: 2, nombre: 'Bici B', estado: 'libre', tiempo: 0 },
//   { id: 3, nombre: 'Bici C', estado: 'libre', tiempo: 0 },
// ];

// export default function ListaBicicletas({ onAlquilar }) {
//   const [bicicletas, setBicicletas] = useState(bicicletasFake);
//   const [error, setError] = useState('');

  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBicicletas(bicis =>
//         bicis.map(bici => {
//           if (bici.estado === 'ocupada') {
//             return { ...bici, tiempo: bici.tiempo + 1 };
//           }
//           return bici;
//         })
//       );
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   function alquilar(id) {
//     const yaTieneUna = bicicletas.some(b => b.estado === 'ocupada');
//     if (yaTieneUna) {
//       setError('Solo puedes alquilar una bicicleta a la vez');
//       setTimeout(() => setError(''), 3000);
//       return;
//     }

//     setBicicletas(bicis =>
//       bicis.map(b =>
//         b.id === id ? { ...b, estado: 'ocupada', tiempo: 0 } : b
//       )
//     );

//     onAlquilar(id);
//   }

//   function devolver(id) {
//     setBicicletas(bicis =>
//       bicis.map(b =>
//         b.id === id ? { ...b, estado: 'libre', tiempo: 0 } : b
//       )
//     );
//   }

//   function formatTiempo(segundos) {
//     const min = Math.floor(segundos / 60).toString().padStart(2, '0');
//     const sec = (segundos % 60).toString().padStart(2, '0');
//     return `${min}:${sec}`;
//   }

//   return (
//     <div className="max-w-lg mx-auto mt-10 px-6 py-4 bg-white rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//         🚲 Bicicletas Disponibles
//       </h2>

//       {error && (
//         <div className="mb-4 text-red-600 text-center font-medium">
//           {error}
//         </div>
//       )}

//       <ul className="space-y-4">
//         {bicicletas.map(bici => (
//           <li
//             key={bici.id}
//             className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border shadow-sm hover:shadow-md transition duration-200"
//           >
//             <div className="text-lg font-medium text-gray-700 mb-2 sm:mb-0">
//               {bici.nombre}
//             </div>

//             {bici.estado === 'libre' ? (
//               <button
//                 onClick={() => alquilar(bici.id)}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow"
//               >
//                 Alquilar
//               </button>
//             ) : (
//               <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                 <div className="flex items-center gap-2 text-blue-600 font-semibold">
//                   <Timer size={18} />
//                   {formatTiempo(bici.tiempo)}
//                 </div>
//                 <button
//                   onClick={() => devolver(bici.id)}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow flex items-center gap-1"
//                 >
//                   <CheckCircle size={16} />
//                   Devolver
//                 </button>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { getStations } from "../services/citybikes";

const BikeStations = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
   
    getStations("ecobici").then(data => {
      // Simulamos el estado en local para poder modificarlo
      const cloned = data.map(station => ({ ...station }));
      setStations(cloned);
    });
  }, []);

 
  const rentBike = (id) => {
    setStations(prev =>
      prev.map(station => {
        if (station.id === id && station.free_bikes > 0) {
          return {
            ...station,
            free_bikes: station.free_bikes - 1,
            empty_slots: station.empty_slots + 1
          };
        }
        return station;
      })
    );
  };

  // Simula devolver una bicicleta
  const returnBike = (id) => {
    setStations(prev =>
      prev.map(station => {
        if (station.id === id && station.empty_slots > 0) {
          return {
            ...station,
            free_bikes: station.free_bikes + 1,
            empty_slots: station.empty_slots - 1
          };
        }
        return station;
      })
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700"> Estaciones de Bicicletas Inteligentes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.slice(0, 12).map(station => (
          <div key={station.id} className="border p-4 rounded-xl shadow hover:shadow-lg transition-all bg-white">
            <h3 className="font-semibold text-lg text-gray-800">{station.name}</h3>
            <p className="text-sm text-gray-500">{station.extra?.address || "Sin dirección"}</p>
            <div className="mt-2 space-y-1">
              <p>🚲 <strong>{station.free_bikes}</strong> disponibles</p>
              <p> <strong>{station.empty_slots}</strong> espacios libres</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => rentBike(station.id)}
                disabled={station.free_bikes === 0}
                className={`px-3 py-1 rounded ${
                  station.free_bikes === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Alquilar 
              </button>
              <button
                onClick={() => returnBike(station.id)}
                disabled={station.empty_slots === 0}
                className={`px-3 py-1 rounded ${
                  station.empty_slots === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Devolver 
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BikeStations;
