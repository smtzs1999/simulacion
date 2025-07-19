
  import React, { useEffect, useState } from 'react';
  import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  

const ListaBicicletas = () => {
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState([19.4326, -99.1332]); // default CDMX
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

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(search)
  );

    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-slate-300 p-6">
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        
          <div className="w-full lg:w-auto">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
</svg>

              </div>
              <select
                onChange={handleNetworkChange}
                value={selectedNetwork?.id}
                className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="ecobici">Ecobici CDMX 🇲🇽</option>
                <option value="valenbisi">Valenbisi 🇪🇸</option>
              </select>
            </div>
          </div>

    
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white rounded-xl shadow p-4 w-40 text-center border-l-4 border-green-500">
              <div className="text-sm text-gray-500 uppercase">Bicicletas</div>
              <div className="text-xl font-bold text-green-600">{total.bikes}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 w-40 text-center border-l-4 border-blue-500">
              <div className="text-sm text-gray-500 uppercase">Espacios libres</div>
              <div className="text-xl font-bold text-blue-600">{total.slots}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 w-40 text-center border-l-4 border-purple-500">
              
              <div className="text-sm text-gray-500 uppercase">Estaciones </div>
              <div className="text-xl font-bold text-purple-600">{stations.length}</div>
            </div>
          </div>
        </div>

      
        <div className="mb-6 relative w-full lg:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar estación..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

    
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="rounded-xl overflow-hidden shadow-lg border bg-white">
              <MapContainer center={location} zoom={13} scrollWheelZoom={true} className="w-full h-[500px]">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {filteredStations.map((station) => (
                  <Marker
                    key={station.id}
                    position={[station.latitude, station.longitude]}
                    icon={customIcon}
                  >
                    <Popup>
                      <strong>{station.name}</strong><br />
                       Bicis: {station.free_bikes}<br />
                       Libres: {station.empty_slots}<br />
                      {station.extra?.address && <div>{station.extra.address}</div>}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

       
          <div className="flex flex-col gap-4 w-full lg:w-[400px] max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-center mb-4 gap-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
</svg>

              <h3 className="text-xl font-semibold">Estaciones</h3>
            </div>

            {filteredStations.length === 0 ? (
              <p className="text-center text-gray-500 italic">No se encontraron estaciones.</p>
            ) : (
              filteredStations.slice(0, 10).map((station) => (
                <div key={station.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-400 hover:shadow-lg transition">
                  <h4 className="font-bold text-gray-800">{station.name}</h4>
                  <p className="text-sm text-gray-600">{station.extra?.address || 'Sin dirección'}</p>
                  <div className="mt-2 text-sm text-gray-700">
                     <strong>{station.free_bikes}</strong> disponibles<br />
                     <strong>{station.empty_slots}</strong> espacios libres
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Última actualización: {new Date(station.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  export default ListaBicicletas;
