import React, { useEffect, useState } from 'react';
import { getUsuarioByUUID, getPostsByUser, getFriendsCount, uploadUserProfileImage } from '../supabase/api';
import { Link } from 'react-router-dom';
import './Profile.css'; // Import the CSS file

export const Profile = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);

  const userUUID = JSON.parse(localStorage.getItem('userId'));
  const authToken = localStorage.getItem('user');

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await uploadUserProfileImage(userUUID, file);
      setProfileImage(`data:image/png;base64,${base64String}`);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.reload();
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
              
              {/* si tenemos un auth token, entonces mostramos el logout. Si no, entonces esta escondido. */}
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
                      <div className="card">
                        <img src={post.PostPath || "https://via.placeholder.com/150"} className="card-img-top" alt="Post" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No posts available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
