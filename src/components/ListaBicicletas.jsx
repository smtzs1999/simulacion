import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
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

const ListaBicicletas = () => {
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState([19.4326, -99.1332]);
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [focusedStationId, setFocusedStationId] = useState(null);
  const [total, setTotal] = useState({ bikes: 0, slots: 0 });

  useEffect(() => {
    fetch('/networks.json')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((net) =>
          ['ecobici', 'valenbisi'].includes(net.id)
        );
        setNetworks(filtered);
        setSelectedNetwork(filtered[0]);
      });
  }, []);

  useEffect(() => {
    if (!selectedNetwork) return;

    const fileMap = {
      ecobici: '/ecobici.json',
      valenbisi: '/valenbisi.json',
    };

    const filePath = fileMap[selectedNetwork.id];

    fetch(filePath)
      .then((res) => res.json())
      .then((data) => {
        const net = data.network;
        setStations(net.stations);
        setLocation([net.location.latitude, net.location.longitude]);

        const bikes = net.stations.reduce((sum, st) => sum + (st.free_bikes || 0), 0);
        const slots = net.stations.reduce((sum, st) => sum + (st.empty_slots || 0), 0);
        setTotal({ bikes, slots });
      });
  }, [selectedNetwork]);

  const handleNetworkChange = (e) => {
    const selected = networks.find((net) => net.id === e.target.value);
    setSelectedNetwork(selected);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleRent = (stationId) => {
    setStations((prev) =>
      prev.map((s) =>
        s.id === stationId && s.free_bikes > 0
          ? { ...s, free_bikes: s.free_bikes - 1, empty_slots: s.empty_slots + 1 }
          : s
      )
    );
  };

  const handleReturn = (stationId) => {
    setStations((prev) =>
      prev.map((s) =>
        s.id === stationId && s.empty_slots > 0
          ? { ...s, free_bikes: s.free_bikes + 1, empty_slots: s.empty_slots - 1 }
          : s
      )
    );
  };

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(search)
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-slate-300 p-6">
      {/* Controles */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
          <select
            onChange={handleNetworkChange}
            value={selectedNetwork?.id}
            className="block w-full lg:w-64 px-4 py-2 rounded-lg border shadow bg-white text-gray-800"
          >
            <option value="ecobici">Ecobici CDMX 🇲🇽</option>
            <option value="valenbisi">Valenbisi 🇪🇸</option>
          </select>
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

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar estación..."
          value={search}
          onChange={handleSearchChange}
          className="w-full lg:max-w-md pl-4 pr-4 py-3 rounded-lg border shadow bg-white"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mapa */}
        <div className="flex-1">
          <div className="rounded-xl overflow-hidden shadow-lg border bg-white">
            <MapContainer center={location} zoom={13} scrollWheelZoom={true} className="w-full h-[500px]">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <FlyToLocation location={focusedLocation} />
              {filteredStations.map((station) => (
                <Marker
                  key={station.id}
                  position={[station.latitude, station.longitude]}
                  icon={station.id === focusedStationId ? redIcon : customIcon}
                >
                  <Popup>
                    <strong>{station.name}</strong><br />
                    Bicis: {station.free_bikes}<br />
                    Libres: {station.empty_slots}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-4 w-full lg:w-[400px] max-h-[600px] overflow-y-auto">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-400 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                setFocusedLocation([station.latitude, station.longitude]);
                setFocusedStationId(station.id);
              }}
            >
              <h4 className="font-bold text-gray-800">{station.name}</h4>
              <p className="text-sm text-gray-600">{station.extra?.address || 'Sin dirección'}</p>
              <div className="mt-2 text-sm text-gray-700">
                <strong>{station.free_bikes}</strong> disponibles<br />
                <strong>{station.empty_slots}</strong> espacios libres
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRent(station.id);
                  }}
                >
                  Alquilar
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded-md shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReturn(station.id);
                  }}
                >
                  Devolver
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Última actualización: {new Date(station.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaBicicletas;
