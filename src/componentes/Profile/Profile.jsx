import React, { useEffect, useState } from 'react';
import { getUsuarioByUUID, getPostsByUser, getFriendsCount, uploadUserProfileImage } from '../supabase/api';
import { Link } from 'react-router-dom';
import './Profile.css';

export const Profile = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);

  const userUUID = JSON.parse(localStorage.getItem('userId'));
  const authToken = localStorage.getItem('user');

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUsuarioByUUID(userUUID);
      setUser(userData);
      setProfileImage(userData.ProfilePic ? `data:image/png;base64,${userData.ProfilePic}` : null);

      const userPosts = await getPostsByUser(userUUID);
      setPosts(userPosts);

      const userFriendsCount = await getFriendsCount(userUUID);
      setFriendsCount(userFriendsCount);
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

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');

    //mandar al home page
    window.location.href = '/';
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
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex flex-column">
        <div className="container">
          <a className="navbar-brand" href="/">Sport Hub</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">

              {authToken && (
                <li>
                  <Link to="/post" className="btn btn-outline-primary ms-2">
                    <i className="bi bi-card-image"></i>
                  </Link>
                </li>
              )}
              
              {/* Si tenemos un auth token, entonces mostramos el logout. Si no, entonces está escondido. */}
              {authToken && (
                <li className="nav-item ms-2">
                  <button className="btn btn-outline-primary" onClick={logout}>
                    <i className="bi bi-box-arrow-right"></i>
                  </button>                  
                </li>                
              )}             
                
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center mb-4 position-relative">
              <div className="profile-pic-container">
                <img 
                  src={profileImage || "https://via.placeholder.com/150"} 
                  className="rounded-circle profile-pic" 
                  alt="User Avatar" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                />
                <input type="file" id="profileImageUpload" className="d-none" onChange={handleImageChange} />
                <label htmlFor="profileImageUpload" className="camera-icon">
                  <i className="bi bi-camera-fill"></i>
                </label>
              </div>
              <div className="ms-4">
                <h3>{user.UserName}</h3>
                <div className="d-flex align-items-center mb-2">
                  <Link to="/edit-profile" className="btn btn-outline-primary me-2">Edit Profile</Link>
                  <Link to="/settings" className="btn btn-outline-secondary">
                    <i className="bi bi-gear"></i>
                  </Link>
                </div>
                <div className="d-flex mb-2">
                  <div className="me-4">
                    <h4>Posts</h4>
                    <p>{posts.length}</p>
                  </div>
                  <div>
                    <h4>Friends</h4>
                    <p>{friendsCount}</p>
                  </div>
                </div>
                <p>{user.Bio}</p>
              </div>
            </div>
            <div>
              <h4>Posts</h4>
              <div className="row">
                {posts.length > 0 ? (
                  posts.map(post => (
                    <div className="col-md-4 mb-3" key={post.id}>
                      <div className="card" style={{ width: '100%', paddingBottom: '75%', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                          {renderMedia(post.PostPath)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay Posts disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
