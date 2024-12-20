import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileComponent } from '../Profile/ProfileComponent';

export const SearchProfile = ({ targetUserUUID, show, handleClose }) => {
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    handleClose(); // Close the modal first
    navigate(`/profile/${targetUserUUID}`); // Navigate to full profile view
  };

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} 
      style={{ 
        display: show ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050
      }}
      onClick={handleClose}
    >
      <div className="modal-dialog modal-xl" style={{ marginTop: '2%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content bg-white">
          <div className="modal-header border-0">
            <h5 className="modal-title text-dark">Perfil</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <ProfileComponent 
              targetUserUUID={targetUserUUID}
              onPostClick={handlePostClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};