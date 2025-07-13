import { useEffect, useState } from 'react';

export default function Temporizador({ activo, onStop }) {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (!activo) return;
    const timer = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activo]);

  function formatearTiempo(s) {
    const min = Math.floor(s / 60);
    const seg = s % 60;
    return `${min.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`;
  }

  if (!activo) return null;

  return (
    <div className="max-w-sm mx-auto mt-6 p-4 border rounded shadow text-center">
      <h3 className="text-lg font-semibold mb-2">Tiempo de viaje</h3>
      <p className="text-3xl font-mono">{formatearTiempo(segundos)}</p>
      <button
        onClick={onStop}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Devolver bicicleta
      </button>
    </div>
  );
}
