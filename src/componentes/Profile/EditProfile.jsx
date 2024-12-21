import React, { useEffect, useState } from 'react';
import { getUsuarioByUUID, getPostsByUser, uploadUserProfileImage, updateUserProfile } from '../supabase/api';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const EditProfile = () => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [posts, setPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  const userUUID = JSON.parse(localStorage.getItem('userId'));
  const authToken = localStorage.getItem('user');

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUsuarioByUUID(userUUID);
      setUser(userData);
      setUsername(userData.UserName);
      setBio(userData.Bio);
      setProfileImage(userData.ProfilePic ? `data:image/png;base64,${userData.ProfilePic}` : null);

      const userPosts = await getPostsByUser(userUUID);
      setPosts(userPosts);
    };

    fetchUserData();
  }, [userUUID]);

  // Manejar cambio de imagen de perfil
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await uploadUserProfileImage(userUUID, file);
      setProfileImage(`data:image/png;base64,${base64String}`);
    }
  };

  // Manejar cambio en los campos de texto
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);

  // Función para actualizar el perfil
  const handleSave = async () => {
    const { error } = await updateUserProfile(userUUID, username, bio, setUsername);
    
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar el perfil',
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Perfil actualizado exitosamente',
      }).then(() => {
        window.location.reload();
      });
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.reload();
  };

  // Renderizar media (imagen o video) de los posts
  const renderMedia = (postPath) => {
    const fileExtension = postPath.split('.').pop().toLowerCase();
    if (fileExtension === 'mp4') {
      return (
        <video className="card-img-top" controls={false} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src={postPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <img src={postPath || "https://via.placeholder.com/150"} className="card-img-top" alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
  };

  return (
    <div style={{ 
        minWidth: '100vw', 
        minHeight: '100vh', 
        backgroundImage: 'url("../Images/fondo_edit.jpg")', // Cambia la URL de la imagen a la que desees
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: '#fff' 
      }}>
      <div className="container" style={{ 
        maxWidth: '800px', 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparente
        borderRadius: '10px', 
        padding: '30px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
        zIndex: 10 
      }}>
        {/* Navbar */}
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
            <Link to="../profile" className="navbar-brand" style={{ color: '#fff' }}>
              <i className="bi bi-arrow-bar-left me-3 text-white fs-4"></i>
            </Link>
            <a className="navbar-brand" href="/" style={{ color: '#fff', fontSize: '24px' }}>Sport Hub</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" style={{ backgroundColor: '#fff' }}></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {authToken && (
                  <li className="nav-item ms-2">
                    <button className="btn btn-outline-light" onClick={logout}>
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

        <div className="card mt-5" style={{ 
          backgroundColor: '#fff', 
          padding: '30px', 
          borderRadius: '8px' // Eliminado el borde negro
        }}>
          <div className="card-body">
            <div className="d-flex flex-column align-items-center mb-4 position-relative">
              <div className="profile-pic-container" style={{
                position: 'relative', 
                width: '150px', 
                height: '150px', 
                borderRadius: '50%', 
                overflow: 'hidden'
              }}>
                <img
                  src={profileImage || "https://via.placeholder.com/150"}
                  className="rounded-circle profile-pic"
                  alt="User Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <input type="file" id="profileImageUpload" className="d-none" onChange={handleImageChange} />
                <label htmlFor="profileImageUpload" className="camera-icon" style={{
                  position: 'absolute', 
                  bottom: '10px', 
                  right: '10px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                  color: '#fff', 
                  padding: '5px', 
                  borderRadius: '50%', 
                  cursor: 'pointer'
                }}>
                  <i className="bi bi-camera-fill"></i>
                </label>
              </div>
              <div className="ms-4 text-center">
                <div className="mb-3">
                  <label htmlFor="usernameInput" className="form-label" style={{ color: '#333' }}>UserName</label>
                  <input
                    type="text"
                    id="usernameInput"
                    className="form-control"
                    value={username}
                    onChange={handleUsernameChange}
                    style={{ backgroundColor: '#fafafa', borderColor: '#ddd', color: '#333' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="bioTextarea" className="form-label" style={{ color: '#333' }}>Biography</label>
                  <textarea
                    id="bioTextarea"
                    className="form-control"
                    rows="3"
                    value={bio}
                    onChange={handleBioChange}
                    style={{ backgroundColor: '#fafafa', borderColor: '#ddd', color: '#333' }}
                  ></textarea>
                </div>
                <button className="btn btn-dark" onClick={handleSave} style={{ backgroundColor: '#333', borderColor: '#333', color: '#fff' }}>
                  Save Changes
                </button>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#333' }}>Posts</h4>
              <div className="row">
                {posts.length > 0 ? (
                  posts.map(post => (
                    <div className="col-md-4 mb-3" key={post.id}>
                      <div className="card" style={{
                        backgroundColor: '#fafafa', 
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                        position: 'relative'
                      }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                          {renderMedia(post.PostPath)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#333' }}>No hay Posts disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
