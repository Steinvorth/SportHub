import React, { useState, useEffect } from 'react';
import { createPost, uploadPostImage, getPostCountByUser } from '../supabase/api';
import { useNavigate } from 'react-router-dom';

export const ManagePost = ({ id }) => {
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [postUUID, setPostUUID] = useState('');
  const [loading, setLoading] = useState(false);

  const userUUID = JSON.parse(localStorage.getItem('userId'));
  const navigate = useNavigate();

  // Generar UUID para el post al cargar el componente
  useEffect(() => {
    const generatePostUUID = async () => {
      const postCount = await getPostCountByUser(userUUID);
      const newPostUUID = `${userUUID}_${postCount + 1}`;
      setPostUUID(newPostUUID);
    };

    generatePostUUID();
  }, [userUUID]);

  // Manejar cambio de imagen
  const handlePictureChange = (e) => {
    setPicture(e.target.files[0]);
  };

  // Manejar cambio de descripción
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Manejar cambio de privacidad
  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
  };

  // Manejar envío del formulario
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
      console.log('Post creado con éxito:', post);
      navigate('/'); // Redirect to home page
    } else {
      console.error('Error al crear el post');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>{id ? 'Editar Post' : 'Crear Post'}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="picture" className="form-label">Foto</label>
              <input type="file" className="form-control" id="picture" onChange={handlePictureChange} />
            </div>
            <hr />
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Descripcion</label>
              <textarea className="form-control" id="description" rows="3" value={description} onChange={handleDescriptionChange}></textarea>
            </div>
            <hr />
            <div className="mb-3">
              <label htmlFor="privacy" className="form-label">Privacidad</label>
              <select className="form-select" id="privacy" value={privacy} onChange={handlePrivacyChange}>
                <option value="public">Publico</option>
                <option value="friends">Privado</option>
              </select>
            </div>
            <a type="submit" className="btn btn-secondary me-2" href='/'>Volver</a>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100px' }}>
              {loading ? (
                <div className="spinner-grow spinner-grow-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                'Publicar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};