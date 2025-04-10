'use client';

import { useState, useEffect } from 'react';
import DeleteUserButton from '../components/DeleteUserButton';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Error al cargar los usuarios');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserDeleted = (deletedUserId) => {
    setUsers(users.filter(user => user.id !== deletedUserId));
  };

  if (loading) return <div className="p-4">Cargando usuarios...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      
      {users.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <div key={user.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <p className="font-medium">{user.nombre || 'Usuario sin nombre'}</p>
                <p className="text-gray-500">ID: {user.id}</p>
              </div>
              <DeleteUserButton userId={user.id} onDelete={handleUserDeleted} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 