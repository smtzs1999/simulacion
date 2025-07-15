export const getStations = async (networkId = "ecobici") => {
  const url = `https://api.citybik.es/v2/networks/${networkId}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.network.stations;
  } catch (error) {
    console.error("Error al obtener las estaciones:", error);
    return [];
  }
};
