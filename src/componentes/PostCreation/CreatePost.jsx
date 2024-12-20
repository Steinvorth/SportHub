import React, { useState, useEffect } from 'react';
import { createPost, uploadPostImage, getPostCountByUser } from '../supabase/api';

export const CreatePost = ({ show, handleClose }) => {
  const [picture, setPicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);
  
  const userUUID = JSON.parse(localStorage.getItem('userId'));

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let postPath = null;
    if (picture) {
      postPath = await uploadPostImage(userUUID, picture);
    }

    const isPrivate = privacy === 'friends';
    const post = await createPost(userUUID, description, isPrivate, postPath);
    if (post.success) {
      setDescription('');
      setPicture(null);
      setPreviewUrl(null);
      setPrivacy('public');
      handleClose();
    } else {
      console.error('Error al crear el post');
    }
    setLoading(false);
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
        zIndex: 1055
      }}
      onClick={handleClose}
    >
      <div className="modal-dialog modal-lg" style={{ marginTop: '2%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content bg-white">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title" style={{ color: '#212529' }}>Crear Post</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="description" className="form-label" style={{ color: '#212529' }}>Descripcion</label>
                <textarea 
                  className="form-control"
                  id="description" 
                  rows="3" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    backgroundColor: '#fff',
                    color: '#212529',
                    border: '1px solid #e9ecef'
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="picture" className="form-label" style={{ color: '#212529' }}>Foto</label>
                <input 
                  type="file" 
                  className="form-control"
                  id="picture" 
                  onChange={handlePictureChange}
                  accept="image/*"
                  style={{
                    backgroundColor: '#fff',
                    color: '#212529',
                    border: '1px solid #e9ecef'
                  }}
                />
              </div>
              
              {previewUrl && (
                <div className="mb-3">
                  <div className="card border-0" style={{ 
                    backgroundColor: '#f8f9fa',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                  }}>
                    <div className="card-body text-center p-3">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="img-fluid rounded"
                        style={{
                          maxHeight: '400px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="privacy" className="form-label" style={{ color: '#212529' }}>Privacidad</label>
                <select 
                  className="form-select"
                  id="privacy" 
                  value={privacy} 
                  onChange={(e) => setPrivacy(e.target.value)}
                  style={{
                    backgroundColor: '#fff',
                    color: '#212529',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <option value="public">Publico</option>
                  <option value="friends">Privado</option>
                </select>
              </div>

              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={handleClose}
                  style={{
                    borderColor: '#e9ecef'
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading || !picture}
                >
                  {loading ? (
                    <div className="spinner-grow spinner-grow-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};