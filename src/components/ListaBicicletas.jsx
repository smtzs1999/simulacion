import { useState } from 'react';

const bicicletasFake = [
  { id: 1, nombre: 'Bici A', estado: 'libre' },
  { id: 2, nombre: 'Bici B', estado: 'ocupada' },
  { id: 3, nombre: 'Bici C', estado: 'libre' },
];

export default function ListaBicicletas({ onAlquilar }) {
  const [bicicletas, setBicicletas] = useState(bicicletasFake);

  function alquilar(id) {
    setBicicletas(bicis =>
      bicis.map(b =>
        b.id === id ? { ...b, estado: 'ocupada' } : b
      )
    );
    onAlquilar(id);
  }

  return (
    <div className="max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Bicicletas disponibles</h2>
      <ul>
        {bicicletas.map(bici => (
          <li
            key={bici.id}
            className="flex justify-between items-center mb-3 p-3 border rounded"
          >
            <span>{bici.nombre}</span>
            {bici.estado === 'libre' ? (
              <button
                onClick={() => alquilar(bici.id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Alquilar
              </button>
            ) : (
              <span className="text-red-600 font-semibold">Ocupada</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
