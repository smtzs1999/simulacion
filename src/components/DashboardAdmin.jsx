import React from 'react';

const DashboardAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          <span className="text-green-600 text-3xl">🚲</span>
          <div>
            <h3 className="text-sm text-gray-500">TOTAL DE BICICLETAS ACTIVAS</h3>
            <p className="text-2xl font-bold">452</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          <span className="text-blue-600 text-3xl">📍</span>
          <div>
            <h3 className="text-sm text-gray-500">ESTACIONES OPERATIVAS</h3>
            <p className="text-2xl font-bold">28</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          <span className="text-orange-500 text-3xl">🚴‍♂️</span>
          <div>
            <h3 className="text-sm text-gray-500">BICICLETAS EN USO</h3>
            <p className="text-2xl font-bold">87</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="font-semibold mb-3">Estaciones</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th>Nombre</th>
                <th>Estado</th>
                <th>Bicis</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Estación A</td><td>Operativa</td><td>12</td></tr>
              <tr><td>Estación B</td><td>Inactiva</td><td>8</td></tr>
              <tr><td>Estación C</td><td>Inactiva</td><td>5</td></tr>
              <tr><td>Estación D</td><td>Operativa</td><td>9</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="font-semibold mb-3">Usuarios Registrados</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th>ID</th>
                <th>Nombre</th>
                <th>Aprel</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1001</td><td>Usuario 1</td><td>1</td></tr>
              <tr><td>1002</td><td>Usuario 2</td><td>2</td></tr>
              <tr><td>1003</td><td>Usuario 3</td><td>3</td></tr>
              <tr><td>1004</td><td>Usuario 4</td><td>1</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="font-semibold mb-3">Alertas y Reportes</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th>Fecha</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>23/04/2024</td><td>Alerta 1</td></tr>
              <tr><td>22/04/2024</td><td>Incidente 2</td></tr>
              <tr><td>22/04/2024</td><td>Problema 3</td></tr>
              <tr><td>21/04/2024</td><td>Reporte 4</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="font-semibold mb-3">Uso por Día/Estación</h4>
          <div className="h-48 bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">[Gráfica de barras aquí]</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="font-semibold mb-3">Tiempo Promedio de Uso</h4>
          <div className="h-48 bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">[Gráfica de líneas aquí]</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
