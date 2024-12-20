import React, { useEffect, useState } from 'react';
import { getUsuarioByUUID, getPostsByUser, getFriendsCount, uploadUserProfileImage } from '../supabase/api';
import { Link } from 'react-router-dom';
import { DetallePost } from './DetallePost';
import './Profile.css';
import { CreatePost } from '../PostCreation/CreatePost';
import { ProfileComponent } from './ProfileComponent';

export const Profile = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const authToken = localStorage.getItem('user');
  const userUUID = JSON.parse(localStorage.getItem('userId'));

  const handlePostCreated = () => {
    setShowCreatePost(false);
  };

  const handleCloseModal = (refresh = false) => {
    setShowModal(false);
    setSelectedPostId(null);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <div style={{ minWidth: '100vw' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex flex-column w-100">
        <div className="container">
          <a className="navbar-brand" href="/">Sport Hub</a>
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

      <ProfileComponent 
        onPostClick={(postId) => {
          setSelectedPostId(postId);
          setShowModal(true);
        }}
        targetUserUUID={userUUID}
      />

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
