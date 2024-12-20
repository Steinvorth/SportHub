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
      <div className="table-responsive bg-light rounded shadow-sm">
        <table className="table">
          <thead>
            <tr className="bg-light">
              <th scope="col" className="text-dark bg-light">Email</th>
              <th scope="col" className="text-dark bg-light">Estado</th>
              <th scope="col" className="text-dark bg-light">Último Ingreso</th>
              <th scope="col" className="text-dark bg-light">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-light">
                <td className="text-dark bg-white">{user.email}</td>
                <td className='bg-white'>
                  <span className={`badge ${user.banned_until ? 'bg-danger' : 'bg-success'}`}>
                    {user.banned_until ? 'Suspendido' : 'Activo'}
                  </span>
                </td>
                <td className="text-dark bg-white">{new Date(user.last_sign_in_at).toLocaleDateString()}</td>
                <td className='bg-white'>
                  <button
                    className={`btn btn-sm ${user.banned_until ? 'btn-warning' : 'btn-success'} me-2`}
                    onClick={() => handleSuspendToggle(user)}
                    title={user.banned_until ? 'Reactivar Usuario' : 'Suspender Usuario'}
                  >
                    <i className={`bi ${user.banned_until ? 'bi-person-fill-lock' : 'bi-person-fill-check'}`}></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Eliminar Usuario"
                  >
                    <i className="bi bi-person-x-fill"></i>
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
