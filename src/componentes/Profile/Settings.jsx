import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updatePrivacySetting } from '../supabase/api';
import { deleteAuthUser } from '../supabase/apiAdmin';
import { useEffect, useState } from 'react';

export const Settings = () => {
  const [userUUID, setUserUUID] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [user, setUser] = useState({});
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const fetchUserUUID = async () => {
      try {
        const uuid = localStorage.getItem('userId');
        const UUID_formatted = uuid.replace(/['"]+/g, ''); // Eliminar comillas simples del UserUUID
        console.log(UUID_formatted);
        if (uuid) {
          setUserUUID(UUID_formatted); // Guardamos el UserUUID en el estado
        } else {
          navigate('/login'); // Redirige a la página de login si no hay sesión
        }
      } catch (error) {
        console.error('Error obteniendo el UserUUID actual:', error.message);
      }
    };
    fetchUserUUID();
  }, [userUUID]);

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Eliminar Cuenta',
      text: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar cuenta',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteAuthUser(userUUID);

        if (response.success) {
          Swal.fire('Cuenta eliminada', response.message, 'success');
          window.location.href = '/';
        }

        localStorage.clear();
        await deleteAuthUser(userUUID);

        await Swal.fire({
          title: 'Cuenta eliminada',
          text: 'Tu cuenta ha sido eliminada exitosamente',
          icon: 'success',
        });

        window.location.href = '/';
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  const handleTogglePrivacy = async () => {
    try {
      const newPrivacySetting = !isPrivate;
      const { data, error } = await updatePrivacySetting(userUUID, newPrivacySetting);

      if (error) throw error;

      setIsPrivate(newPrivacySetting);

      Swal.fire(
        'Configuración actualizada',
        `Tu perfil ahora es ${newPrivacySetting ? 'privado' : 'público'}.`,
        'success'
      );
    } catch (error) {
      console.error('Error actualizando configuración de privacidad:', error.message);
      Swal.fire(
        'Error',
        'No se pudo actualizar la configuración de privacidad. Intenta nuevamente.',
        'error'
      );
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light w-100" style={{ 
        backgroundColor: '#000', 
        color: '#fff',
        width: '100vw',
        position: 'fixed',
        top: 0,
        zIndex: 1000
      }}>
        <div className="container">
          <Link to="/" className="d-flex align-items-center">
            <i className="bi bi-arrow-left" style={{ color: '#fff', fontSize: '1.5rem', marginRight: '10px' }}></i>
            <span
              className="navbar-brand"
              style={{
                color: '#fff',
                cursor: 'pointer',
                fontSize: '2rem',
                textAlign: 'center', // Asegura que el nombre se centre
                display: 'block',
                width: '300%', // Ajuste aquí
              }}
            >
              Sport Hub
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto"></ul>
          </div>
        </div>
      </nav>

      {/* Settings Section */}
      <div
        className="container-fluid p-0"
        style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url("../Images/fondo.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginTop: '56px' // Height of navbar
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '2rem',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '600px',
            textAlign: 'center',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h2 style={{ color: 'black', marginBottom: '30px' }}>Configuración</h2>

          <div className="list-group mt-4" style={{ width: '100%' }}>
            {/* Eliminar Cuenta */}
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveSection(activeSection === 'delete' ? null : 'delete')}
              style={{
                backgroundColor: '#ffffff',
                color: 'black',
                borderRadius: '10px',
                marginBottom: '10px',
                padding: '15px',
                textAlign: 'center',
                fontSize: '16px',
              }}
            >
              Eliminar Cuenta
            </button>
            {/* Cambiar Contraseña */}
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveSection(activeSection === 'change-password' ? null : 'change-password')}
              style={{
                backgroundColor: '#ffffff',
                color: 'black',
                borderRadius: '10px',
                marginBottom: '10px',
                padding: '15px',
                textAlign: 'center',
                fontSize: '16px',
              }}
            >
              Cambiar Contraseña
            </button>
            {/* Configuración de privacidad */}
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveSection(activeSection === 'privacy' ? null : 'privacy')}
              style={{
                backgroundColor: '#ffffff',
                color: 'black',
                borderRadius: '10px',
                marginBottom: '10px',
                padding: '15px',
                textAlign: 'center',
                fontSize: '16px',
              }}
            >
              Configuración de privacidad
            </button>
          </div>

          {/* Dynamic Section Content Below All Options */}
          <div className="mt-4">
            {activeSection === 'delete' && (
              <div
                id="delete-account-settings"
                className="mt-3"
                style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px' }}
              >
                <p style={{ color: 'black' }}>Para eliminar tu cuenta, haz clic en el botón de abajo. Se te pedirá confirmación.</p>
                <i className="bi bi-exclamation-lg text-danger fs-3 mt-5"></i>
                <button className="btn btn-danger" onClick={handleDeleteAccount} style={{ width: '100%' }}>
                  Eliminar cuenta
                </button>
              </div>
            )}
            {activeSection === 'change-password' && (
              <div
                id="change-password-settings"
                className="mt-3"
                style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px' }}
              >
                <p style={{ color: 'black' }}>Si desea hacer un cambio de contraseña, pulse la siguiente opción</p>
                <hr />
                <Link to="../ResetPassword">
                  <button className="btn btn-warning" style={{ width: '100%' }}>Cambiar Contraseña</button>
                </Link>
              </div>
            )}
            {activeSection === 'privacy' && (
              <div
                id="privacy-settings"
                className="mt-3"
                style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px' }}
              >
                <p style={{ color: 'black' }}>Aquí podrás ajustar tus configuraciones de privacidad:</p>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="privacyToggle"
                    checked={isPrivate}
                    onChange={handleTogglePrivacy}
                    style={{ accentColor: '#003366' }}
                  />
                  <label className="form-check-label" htmlFor="privacyToggle" style={{ color: 'black' }}>
                    {isPrivate ? 'Perfil Privado' : 'Perfil Público'}
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
