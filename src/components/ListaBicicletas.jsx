 import React, { useEffect, useState,useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import Temporizador from './Temporizador';
// import { ref, onValue } from "firebase/database";
import {  database } from '../firebase/firebase';
import HistorialDeViajes from './Historial';
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import AlertMessage from './AlertMessage';

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const FlyToLocation = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 16);
    }
  }, [location, map]);
  return null;
};

const RoutingMachine = ({ origen, destino }) => {
  const map = useMap();
  useEffect(() => {
    if (!origen || !destino) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(origen[0], origen[1]), L.latLng(destino[0], destino[1])],
      lineOptions: {
        styles: [{ color: 'blue', opacity: 0.6, weight: 4 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      routeWhileDragging: false,
      createMarker: () => null,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [origen, destino, map]);

  return null;
};

const ListaBicicletas = ( ) => {
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState([19.4326, -99.1332]);
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [viajeActivo, setViajeActivo] = useState(null);
  const [destino, setDestino] = useState(null);
  const [total, setTotal] = useState({ bikes: 0, slots: 0 });
  const [cityName, setCityName] = useState('');
const [alert, setAlert] = useState(null);
const [confirmAlquiler, setConfirmAlquiler] = useState({ show: false, station: null });
const alertRef = useRef(null);


const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
  };
  const closeAlert = () => setAlert({ show: false, message: '', type: 'info' });

  const requestRent = (station) => {
    if (station.free_bikes === 0) {
      showAlert('No hay bicicletas disponibles en esta estación.', 'error');
      return;
    }
    setConfirmAlquiler({ show: true, station });
  };
  const confirmRent = () => {
    const station = confirmAlquiler.station;
    if (!station) return;

    // Actualizar estados igual que antes
    setStations((prev) =>
      prev.map((s) =>
        s.id === station.id && s.free_bikes > 0
          ? { ...s, free_bikes: s.free_bikes - 1, empty_slots: s.empty_slots + 1 }
          : s
      )
    );
    setViajeActivo({ id: station.id, name: station.name, lat: station.latitude, lng: station.longitude });
    setDestino(null);

    showAlert(`Has alquilado una bicicleta en la estación "${station.name}". Recuerda elegir una estación destino para devolverla.`, 'success');

    // Añadir viaje al historial
    setHistorial((h) => [...h, { inicio: station.name, destino: null, duracion: 'En curso', fecha: new Date().toLocaleString(), inicioTimestamp: Date.now() }]);

    setConfirmAlquiler({ show: false, station: null });
  };

  const mostrarAlerta = (titulo, mensaje, tipo = 'info') => {
  if (alertRef?.current?.show) {
    alertRef.current.show(titulo, mensaje, tipo);
  } else {
    console.warn('AlertMessage no está listo aún.');
  }
};

const alquilarBicicleta = (station) => {
    // ejemplo simple
    if (!station || !station.name) {
      mostrarAlerta('Error', 'Estación no válida.', 'error');
      return;
    }

    // Aquí podrías guardar en Firebase y luego...
    mostrarAlerta(
      'Alquiler Confirmado',
      `Has alquilado una bicicleta en la estación "${station.name}". ¡Buen viaje! 🚴‍♂️`,
      'success'
    );
  };

  const cancelRent = () => {
  setConfirmAlquiler({ show: false, station: null });
};


  // Historial local
  const [historial, setHistorial] = useState(() => {
    // Cargar del localStorage si existe
    const guardado = localStorage.getItem('historialViajes');
    return guardado ? JSON.parse(guardado) : [];
  });
// const guardarViajeEnBD = (viajeEnCurso) => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (!user) {
//     console.error("Usuario no autenticado.");
//     return;
//   }

//   const nuevoViaje = {
//     usuario: user.email,
//     bicicleta: viajeEnCurso.bicicleta,
//     estacionInicio: viajeEnCurso.inicio,
//     estacionFin: viajeEnCurso.fin,
//     duracion: viajeEnCurso.duracion,
//     fecha: new Date().toISOString(),
//   };

//   const viajesRef = ref(database, 'historial_viajes');
//   push(viajesRef, nuevoViaje)
//     .then(() => {
//       console.log("Viaje guardado exitosamente en Firebase");
//     })
//     .catch((error) => {
//       console.error("Error al guardar el viaje:", error);
//     });
// };

  const guardarViajeEnFirebase = (viajeEnCurso) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("Usuario no autenticado.");
    return;
  }

  const nuevoViaje = {
    usuario: user.email,
    bicicleta: viajeEnCurso.bicicleta || "desconocida",
    inicio: viajeEnCurso.inicio || "desconocido",
    destino: viajeEnCurso.destino || "desconocido",
    duracion: viajeEnCurso.duracion || "00:00",
    fecha: viajeEnCurso.fecha || new Date().toISOString(),
  };

  const viajesRef = ref(database, `historial_viajes/${user.uid}`);
  push(viajesRef, nuevoViaje)
    .then(() => {
      console.log("Viaje guardado exitosamente en Firebase");
    })
    .catch((error) => {
      console.error("Error al guardar el viaje:", error);
    });
};


const obtenerHistorial = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const db = getDatabase();
  const historialRef = ref(db, `historial_viajes/${user.uid}`);

  onValue(historialRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const historialFirebase = Object.values(data);
      setHistorial(historialFirebase);
    } else {
      setHistorial([]);
    }
  });
};


  // useEffect(() => {
  //   fetch('/networks.json')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const filtered = data.filter((net) => ['ecobici', 'valenbisi'].includes(net.id));
  //       setNetworks(filtered);
  //       setSelectedNetwork(filtered[0]);
  //     });
  // }, []);
useEffect(() => {
    // Si quieres, puedes guardar estas redes también en Firebase,
    // pero aquí hardcodeamos las disponibles.
    const availableNetworks = [
  { id: "ecobici", name: "EcoBici", location: { city: "Ciudad de México" } },
  { id: "valenbisi", name: "Valenbisi", location: { city: "Valencia" } },
];

    setNetworks(availableNetworks);
    setSelectedNetwork(availableNetworks[0]);
  }, []);

  useEffect(() => {
    if (!selectedNetwork) return;

    const dbRef = ref(database, `redes_estaciones/network`);



    onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data || !data.stations) {
  alert("Error: No se encontraron estacion")

          return;
        }

        if (data.id !== selectedNetwork.id) {
          console.warn("La red seleccionada no coincide con los datos en Firebase");
          // Opcional: manejar esto si tienes más redes en Firebase
          return;
        }

        setStations(data.stations);
        setLocation([data.location.latitude, data.location.longitude]);
        setCityName(data.location.city); 

        const bikes = data.stations.reduce(
          (sum, st) => sum + (st.free_bikes || 0),
          0
        );
        const slots = data.stations.reduce(
          (sum, st) => sum + (st.empty_slots || 0),
          0
        );
        setTotal({ bikes, slots });
      },
      { onlyOnce: true } // lee solo una vez, o quita para escucha en tiempo real
    );
  }, [selectedNetwork]);

  // Guardar historial en localStorage cada vez que cambia
//   useEffect(() => {
//   guardarViajeEnFirebase(nuevoViaje);
// }, [historial]);
useEffect(() => {
  const auth = getAuth();
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      obtenerHistorial();
    } else {
      setHistorial([]);
    }
  });
  return () => unsubscribe();
}, []);



  const handleRent = (stationId, stationName, lat, lng) => {
    
    setStations((prev) =>
      
      prev.map((s) =>
        s.id === stationId && s.free_bikes > 0
          ? { ...s, free_bikes: s.free_bikes - 1, empty_slots: s.empty_slots + 1 }
          : s
      )
    );
    setViajeActivo({ id: stationId, name: stationName, lat, lng });
    setDestino(null);

    // Añadir viaje al historial
    setHistorial((h) => [...h, { inicio: stationName, destino: null, duracion: 'En curso', fecha: new Date().toLocaleString(), inicioTimestamp: Date.now() }]);
    setAlert({ message: `Has alquilado una bicicleta en ${stationName}`, type: 'success' });
  setTimeout(() => setAlert(null), 3500);
  };

  const handleReturn = (stationId) => {
    setHistorial((h) => {
      const copia = [...h];
      const viajeEnCurso = copia.find((v) => v.duracion === 'En curso');
      if (viajeEnCurso) {
        const duracionSegs = Math.floor((Date.now() - viajeEnCurso.inicioTimestamp) / 1000);
        const minutos = Math.floor(duracionSegs / 60);
        const segundos = duracionSegs % 60;
        viajeEnCurso.duracion = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        const estacionDestino = stations.find(s => s.id === stationId);
        viajeEnCurso.destino = estacionDestino ? estacionDestino.name : 'Desconocido';

        guardarViajeEnFirebase({
          ...viajeEnCurso,
          fecha: new Date().toISOString()
        });

        showAlert(`Viaje finalizado en estación "${viajeEnCurso.destino}". Duración: ${viajeEnCurso.duracion}`, 'success');
      }
      return copia;
    });

    setViajeActivo(null);
    setDestino(null);
  

  const estacion = stations.find(s => s.id === stationId);
  setAlert({ message: `Bicicleta devuelta en ${estacion ? estacion.name : 'la estación'}`, type: 'info' });
  setTimeout(() => setAlert(null), 3500);
};


  const handleSetDestino = (station) => {
    if (viajeActivo && station.id !== viajeActivo.id) {
      setDestino({ id: station.id, lat: station.latitude, lng: station.longitude });
    }
  };
   const handleNetworkChange = (e) => {
    const selected = networks.find((net) => net.id === e.target.value);
    setSelectedNetwork(selected);
  };

  const handleSearchChange = (e) => setSearch(e.target.value.toLowerCase());

  const filteredStations = stations.filter((s) => s.name.toLowerCase().includes(search));

  const visibleStations = viajeActivo && destino
    ? stations.filter((s) => [viajeActivo.id, destino.id].includes(s.id))
    : filteredStations;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-slate-300 p-6">
    {alert && (
  <AlertMessage
    message={alert.message}
    type={alert.type}
    onClose={() => setAlert(null)}
  />
)}

      {/* Controles */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
  <select
    onChange={handleNetworkChange}
    value={selectedNetwork?.id}
    className="block w-full lg:w-64 px-4 py-2 rounded-lg border shadow bg-white text-gray-800"
  >
    {networks.map((net) => (
  <option key={net.id} value={net.id}>
  {net.location?.city || net.name}
</option>

))}

  </select>
  {/* <div className="text-gray-600 mt-1 italic">
  Ciudad: {selectedNetwork?.location?.city || cityName || 'N/A'}
</div> */}

</div>


        <div className="flex gap-4">
          <div className="bg-white rounded-xl shadow p-4 w-40 text-center border-l-4 border-green-500">
            <div className="text-sm text-gray-500">Bicicletas</div>
            <div className="text-xl font-bold text-green-600">{total.bikes}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 w-40 text-center border-l-4 border-blue-500">
            <div className="text-sm text-gray-500">Espacios libres</div>
            <div className="text-xl font-bold text-blue-600">{total.slots}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 w-40 text-center border-l-4 border-purple-500">
            <div className="text-sm text-gray-500">Estaciones</div>
            <div className="text-xl font-bold text-purple-600">{stations.length}</div>
          </div>
        </div>
      </div>
      

    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-slate-300 p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar estación..."
          value={search}
          onChange={handleSearchChange}
          className="w-full lg:max-w-md pl-4 pr-4 py-3 rounded-lg border shadow bg-white"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="rounded-xl overflow-hidden shadow-lg border bg-white">
            <AlertMessage ref={alertRef} />
            <MapContainer center={location} zoom={13} scrollWheelZoom={true} className="w-full h-[500px]">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <FlyToLocation location={focusedLocation} />
              {viajeActivo && destino && (
                <RoutingMachine origen={[viajeActivo.lat, viajeActivo.lng]} destino={[destino.lat, destino.lng]} />
              )}
              {visibleStations.map((station) => (
                <Marker
                  key={station.id}
                  position={[station.latitude, station.longitude]}
                  icon={station.id === viajeActivo?.id ? redIcon : customIcon}
                >
                  <Popup>{station.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-[400px] max-h-[600px] overflow-y-auto">
          {filteredStations.map((station) => {
            const esActiva = viajeActivo?.id === station.id;
            const esDestino = destino?.id === station.id;
            const puedeElegirDestino = viajeActivo && !esActiva && station.empty_slots > 0;

            return (
              <div
  key={station.id}
  className={`border-2 ${
  esActiva ? 'border-green-500' : esDestino ? 'border-purple-500' : 'border-gray-300'
} hover:shadow-lg transition cursor-pointer relative`}
onClick={() => setFocusedLocation([station.latitude, station.longitude])}
>
  {/* Header */}
  <div className="flex justify-between items-center mb-2">
    <h4 className="font-bold text-gray-800">{station.name}</h4>
    <span
      className={`text-xs font-semibold px-2 py-1 rounded ${
        station.free_bikes === 0
          ? 'bg-red-100 text-red-600'
          : station.empty_slots === 0
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-green-100 text-green-700'
      }`}
    >
      {station.free_bikes === 0
        ? 'Sin bicis'
        : station.empty_slots === 0
        ? 'Llena'
        : 'Disponible'}
    </span>
  </div>


  {/* Dirección */}
  <p className="text-sm text-gray-600 mb-2">{station.extra?.address || 'Sin dirección'}</p>

  {/* Estado visual */}
  <div className="flex items-center justify-between text-sm text-gray-700">
    <div>
      🚲 <strong>{station.free_bikes}</strong> bicis
    </div>
    <div>
      🅿️ <strong>{station.empty_slots}</strong> espacios
    </div>
  </div>

  {/* Barra visual de ocupación */}
  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
  <div
    className="bg-blue-500 h-2 rounded-full"
    style={{
      width: `${
        (station.free_bikes / (station.free_bikes + station.empty_slots)) * 100 || 0
      }%`,
    }}
  ></div>
</div>


  {/* Temporizador, botones, acciones */}
  {esActiva ? (
    <>
      <Temporizador activo={true} />
      {destino ? (
        <p className="mt-3 text-sm text-gray-600">
          Dirígete a la estación seleccionada para devolver.
        </p>
      ) : (
        <p className="mt-3 text-sm text-gray-600">
          Elige una estación destino haciendo click en la lista.
        </p>
      )}
    </>
  ) : esDestino && viajeActivo ? (
    <button
      className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-md shadow"
      onClick={(e) => {
        e.stopPropagation();
        handleReturn(station.id);
      }}
    >
      Devolver bicicleta
    </button>
  ) : puedeElegirDestino ? (
    <button
      className="mt-4 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md shadow"
      onClick={(e) => {
        e.stopPropagation();
        handleSetDestino(station);
      }}
      disabled={esDestino}
    >
      {esDestino ? 'Destino seleccionado' : 'Elegir como destino'}
    </button>
  ) : (
    !viajeActivo &&
    station.free_bikes > 0 && (
      
      <button
        className="mt-4 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md shadow"
        onClick={(e) => {
          e.stopPropagation();
          handleRent(station.id, station.name, station.latitude, station.longitude);
          requestRent(station);
        }}
      >
        Alquilar bicicleta
      </button>
    )
  )}

  <p className="text-xs text-gray-400 mt-3">
    Última actualización: {new Date(station.timestamp).toLocaleTimeString()}
  </p>
</div>

            );
          })}
          {confirmAlquiler.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Confirmar alquiler</h3>
            <p className="mb-6">
              ¿Estás seguro que quieres alquilar una bicicleta en la estación "{confirmAlquiler.station.name}"?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRent}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirmar
              </button>
              <button
                onClick={cancelRent}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
{/* Alert general para mensajes */}
      {alert && (
  <AlertMessage
    message={alert.message}
    type={alert.type}
    onClose={closeAlert}
  />
)}

    

        </div>
      </div>
    </div>
    </div>
  );
};

export default ListaBicicletas;