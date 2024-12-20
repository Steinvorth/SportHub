import React, { useState, useEffect } from 'react';
import { getAllUsers, suspendUser, unsuspendUser, deleteAuthUser } from '../supabase/apiAdmin';
import { deleteUser } from '../supabase/api';

export const AdminUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const usersData = await getAllUsers();
    setUsers(usersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspendToggle = async (user) => {
    if (user.banned_until) {
      await unsuspendUser(user.id);
    } else {
      await suspendUser(user.id);
    }
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      await deleteAuthUser(userId);
      await deleteUser(userId);
      fetchUsers();
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando usuarios...</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-dark">Gestión de Usuarios</h3>
      <div className="table-responsive">
        <table className="table table-hover bg-white">
          <thead>
            <tr>
              <th>Email</th>
              <th>Estado</th>
              <th>Último Ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.banned_until ? 'bg-danger' : 'bg-success'}`}>
                    {user.banned_until ? 'Suspendido' : 'Activo'}
                  </span>
                </td>
                <td>{new Date(user.last_sign_in_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className={`btn btn-sm ${user.banned_until ? 'btn-success' : 'btn-warning'} me-2`}
                    onClick={() => handleSuspendToggle(user)}
                  >
                    {user.banned_until ? 'Reactivar' : 'Suspender'}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
