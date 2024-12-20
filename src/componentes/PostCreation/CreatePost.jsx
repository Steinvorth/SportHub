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
         style={{ display: show ? 'block' : 'none' }} 
         tabIndex="-1" 
         role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear Post</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="picture" className="form-label">Foto</label>
                <input 
                  type="file" 
                  className="form-control" 
                  id="picture" 
                  onChange={handlePictureChange}
                  accept="image/*"
                />
              </div>
              
              {previewUrl && (
                <div className="mb-3 text-center">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="img-fluid" 
                    style={{maxHeight: '400px'}}
                  />
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Descripcion</label>
                <textarea 
                  className="form-control" 
                  id="description" 
                  rows="3" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="privacy" className="form-label">Privacidad</label>
                <select 
                  className="form-select" 
                  id="privacy" 
                  value={privacy} 
                  onChange={(e) => setPrivacy(e.target.value)}
                >
                  <option value="public">Publico</option>
                  <option value="friends">Privado</option>
                </select>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleClose}
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