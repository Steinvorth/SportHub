import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileComponent } from '../Profile/ProfileComponent';
import supabase from '../supabase/supabase';

export const SearchProfile = ({ targetUserUUID, show, handleClose }) => {
  const [userUUID, setUserUUID] = useState('');
  const [isBlocked, setIsBlocked] = useState(false); // Estado para saber si el usuario está bloqueado
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserUUID = async () => {
      try {
        const uuid = localStorage.getItem('userId');
        const UUID_formatted = uuid?.replace(/['"]+/g, ''); // Eliminar comillas
        if (UUID_formatted) {
          setUserUUID(UUID_formatted);
        } else {
          navigate("/login"); // Redirige a login si no hay sesión
        }
      } catch (error) {
        console.error("Error obteniendo el UserUUID actual:", error.message);
      }
    };

    const checkIfBlocked = async () => {
      if (!userUUID || !targetUserUUID) return;

      try {
        const { data, error } = await supabase
          .from('UsuariosBloqueados')
          .select('*')
          .eq('blocker_uuid', userUUID)
          .eq('blocked_uuid', targetUserUUID);

        if (error) throw error;
        setIsBlocked(data.length > 0); 
      } catch (error) {
        console.error("Error verificando si el usuario está bloqueado:", error.message);
      }
    };

    fetchUserUUID();
    checkIfBlocked();
  }, [userUUID, targetUserUUID, navigate]);

  // Método para bloquear usuarios
  const handleBlockUser = async () => {
    try {
      const { data, error } = await supabase
        .from('UsuariosBloqueados')
        .insert([{ blocker_uuid: userUUID, blocked_uuid: targetUserUUID }]);

      if (error) throw error;

      setIsBlocked(true);
      alert("Usuario bloqueado exitosamente.");
    } catch (error) {
      console.error("Error al bloquear al usuario:", error.message);
      alert("No se pudo bloquear al usuario.");
    }
  };

  // Método para desbloquear usuarios
  const handleUnblockUser = async () => {
    try {
      const { data, error } = await supabase
        .from('UsuariosBloqueados')
        .delete()
        .eq('blocker_uuid', userUUID)
        .eq('blocked_uuid', targetUserUUID);

      if (error) throw error;

      setIsBlocked(false);
      alert("Usuario desbloqueado exitosamente.");
    } catch (error) {
      console.error("Error al desbloquear al usuario:", error.message);
      alert("No se pudo desbloquear al usuario.");
    }
  };

  const handlePostClick = () => {
    handleClose();
    navigate(`/profile/${targetUserUUID}`);
  };

  return (
    <div
      className={`modal fade ${show ? 'show' : ''}`}
      style={{
        display: show ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050,
      }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-xl"
        style={{ marginTop: '2%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-white">
          <div className="modal-header border-0 align-items-center">
            <h5 className="modal-title text-dark me-3">Perfil</h5>
            <button
              className={`btn ${
                isBlocked ? 'btn-outline-success' : 'btn-outline-danger'
              } d-flex align-items-center`}
              onClick={isBlocked ? handleUnblockUser : handleBlockUser}
            >
              <i className={`bi ${isBlocked ? 'bi-unlock' : 'bi-ban'} me-2`}></i>
              {isBlocked ? "Desbloquear Usuario" : "Bloquear Usuario"}
            </button>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {isBlocked ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <h2 className="text-center text-danger">Este usuario está bloqueado</h2>
              </div>
            ) : (
              <ProfileComponent
                targetUserUUID={targetUserUUID}
                onPostClick={handlePostClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
