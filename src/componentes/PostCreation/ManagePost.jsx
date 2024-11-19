import React, { useState } from 'react';

export const ManagePost = ({ id }) => {
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');

  const handlePictureChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ picture, description, privacy });
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
                <option value="friends">Amigos</option>
              </select>
            </div>
            <a type="submit" className="btn btn-secondary me-2" href='/'>Volver</a>
            <button type="submit" className="btn btn-primary">Publicar</button>
          </form>
        </div>
      </div>
    </div>
  );
};
