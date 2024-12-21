import React, { useEffect, useState } from 'react';
import { getUsuarioByUUID, getPostsByUser, getFriendsCount, uploadUserProfileImage } from '../supabase/api';
import { Link, useParams } from 'react-router-dom';
import { DetallePost } from './DetallePost';
import './Profile.css';
import { CreatePost } from '../PostCreation/CreatePost';
import { ProfileComponent } from './ProfileComponent';

// Importaciones necesarias y estado inicial
export const Profile = () => {
  const { userId } = useParams();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const authToken = localStorage.getItem('user');
  
  // Si userId de los parámetros existe, úsalo, de lo contrario usa el UUID del usuario actual
  const userUUID = userId || JSON.parse(localStorage.getItem('userId'));

  // Maneja la creación de un nuevo post
  const handlePostCreated = () => {
    setShowCreatePost(false);
  };

  // Maneja el cierre del modal de detalle de post
  const handleCloseModal = (refresh = false) => {
    setShowModal(false);
    setSelectedPostId(null);
    if (refresh) {
      handleRefresh();
    }
  };

  // Maneja la actualización de la página
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <div style={{ 
        minWidth: '100vw', 
        minHeight: '100vh', 
        backgroundImage: 'url("../Images/fondo_edit.jpg")', // Cambia la URL de la imagen a la que desees
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Mantiene la imagen fija mientras se hace scroll
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: '#fff' 
      }}>
      <div className="container" style={{
        maxWidth: '800px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semitransparente
        borderRadius: '10px',
        padding: '30px',
        zIndex: 10
      }}>
        {/* Barra de navegación */}
        <nav className="navbar navbar-expand-lg navbar-light" style={{
          backgroundColor: '#333',
          width: '100%',
          marginBottom: '30px',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000
        }}>
          <div className="container-fluid">
            <a className="navbar-brand" href="/" style={{ color: '#fff' }}>
              <i className="bi bi-arrow-bar-left me-3 text-white fs-4"></i>
            </a>
            <a className="navbar-brand" href="/" style={{ color: '#fff', fontSize: '24px' }}>Sport Hub</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" style={{ backgroundColor: '#fff' }}></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {authToken && (
                  <li>
                    <button 
                      className="btn btn-outline-primary ms-2"
                      onClick={() => setShowCreatePost(true)}
                    >
                      <i className="bi bi-card-image"></i>
                    </button>
                  </li>
                )}
                {authToken && (
                  <li className="nav-item ms-2">
                    <button className="btn btn-outline-primary" onClick={logout}>
                      <Link to="/">
                        <i className="bi bi-box-arrow-right"></i>
                      </Link>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Componente de Perfil */}
        <ProfileComponent 
          onPostClick={(postId) => {
            setSelectedPostId(postId);
            setShowModal(true);
          }}
          targetUserUUID={userUUID}
          refreshTrigger={refreshTrigger}
        />

        {/* Modales para crear post y ver detalle del post */}
        <CreatePost 
          show={showCreatePost} 
          handleClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />

        {selectedPostId && (
          <DetallePost
            postId={selectedPostId}
            show={showModal}
            handleClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};
