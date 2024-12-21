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

  const userUUID = userId || JSON.parse(localStorage.getItem('userId'));

  const handlePostCreated = () => {
    setShowCreatePost(false);
  };

  const handleCloseModal = (refresh = false) => {
    setShowModal(false);
    setSelectedPostId(null);
    if (refresh) {
      handleRefresh();
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <div style={{ minWidth: '100vw' }}>
      {/* Barra de navegación estilizada */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{
          backgroundColor: '#000',
          padding: '10px 20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="container">
          <a
            className="navbar-brand"
            href="/"
            style={{
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '1.5rem',
            }}
          >
            Sport Hub
          </a>
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
            <ul className="navbar-nav ms-auto d-flex align-items-center">
              {authToken && (
                <li>
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={() => setShowCreatePost(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px 10px',
                      borderRadius: '20px',
                    }}
                  >
                    <i className="bi bi-card-image" style={{ fontSize: '1.2rem' }}></i>
                  </button>
                </li>
              )}
              {authToken && (
                <li className="nav-item ms-2">
                  <button
                    className="btn btn-outline-light"
                    onClick={logout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px 10px',
                      borderRadius: '20px',
                    }}
                  >
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <i className="bi bi-box-arrow-right" style={{ fontSize: '1.2rem' }}></i>
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
  );
};
