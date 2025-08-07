import { useEffect, useState } from "react";

const Temporizador = ({ activo }) => {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
  let intervalo;

  if (activo) {
    intervalo = setInterval(() => {
      setSegundos((prev) => prev + 1);
    }, 1000);
  } else {
    setSegundos(0); // Reinicia segundos si se detiene
  }

  return () => clearInterval(intervalo); // Limpieza del intervalo
}, [activo]);
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return (
    <div className="mt-2 text-sm text-blue-600 font-mono">
      {String(minutos).padStart(2, "0")}:
      {String(segundosRestantes).padStart(2, "0")}
    </div>
  );
};
export default Temporizador;
