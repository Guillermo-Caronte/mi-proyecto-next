'use client';

import { useState, useEffect } from 'react';

export default function Client() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/getUsers');
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (codigoCliente) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }
  
    setDeletingId(codigoCliente);
  
    try {
      const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigoCliente }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar el cliente');
      }
  
      setClientes(clientes.filter(cliente => cliente.CODIGOCLIENTE !== codigoCliente));
      alert('Cliente eliminado con éxito');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes.map((cliente) => (
          <div key={cliente.CODIGOCLIENTE} className="bg-white p-4 rounded-lg shadow text-black">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">Cliente: {cliente.CODIGOCLIENTE}</h2>
              <button
                onClick={() => handleDelete(cliente.CODIGOCLIENTE)}
                disabled={deletingId === cliente.CODIGOCLIENTE}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {deletingId === cliente.CODIGOCLIENTE ? 'Eliminando...' : 'Eliminar Cliente'}
              </button>
            </div>
            <p><span className="font-bold">Nombre:</span> {cliente.NOMBRECLIENTE}</p>
            <p><span className="font-bold">Apellidos:</span> {cliente.APELLIDO1CLIENTE} {cliente.APELLIDO2CLIENTE}</p>
            <p><span className="font-bold">Dirección:</span> {cliente.DIRECCION}</p>
            <p><span className="font-bold">Teléfono:</span> {cliente.TELEFONO}</p>
            {cliente.OBSERVACIONES && (
              <p><span className="font-bold">Observaciones:</span> {cliente.OBSERVACIONES}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
