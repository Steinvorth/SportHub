import React, { useEffect, useState } from 'react';
import { getUsuarioByUUID, getPostsByUser, getFriendsCount, uploadUserProfileImage } from '../supabase/api';
import { Link } from 'react-router-dom';
import { DetallePost } from './DetallePost';
import './Profile.css';
import { CreatePost } from '../PostCreation/CreatePost';

export const Profile = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [googleAvatar, setGoogleAvatar] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const userUUID = JSON.parse(localStorage.getItem('userId'));
  const authToken = localStorage.getItem('user');

  useEffect(() => {
    // Check if user is logged in with Google
    const googleAuthToken = localStorage.getItem('sb-uxiytxuyozhaolqjauzv-auth-token');
    if (googleAuthToken) {
      try {
        const parsedToken = JSON.parse(googleAuthToken);
        const metadata = parsedToken.user?.user_metadata;
        if (metadata?.avatar_url) {
          setIsGoogleUser(true);
          setGoogleAvatar(metadata.avatar_url);
        }
      } catch (error) {
        console.error('Error parsing Google auth token:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [userUUID]);

  const fetchUserData = async () => {
    const userData = await getUsuarioByUUID(userUUID);
    setUser(userData);
    
    // Only set profile image from database if not Google user
    if (!isGoogleUser) {
      setProfileImage(userData.ProfilePic ? `data:image/png;base64,${userData.ProfilePic}` : null);
    }

    const userPosts = await getPostsByUser(userUUID);
    setPosts(userPosts);

    const userFriendsCount = await getFriendsCount(userUUID);
    setFriendsCount(userFriendsCount);
  };

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
    window.location.href = '/';
  };

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

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setShowModal(true);
  };

  const handleCloseModal = (refresh = false) => {
    setShowModal(false);
    setSelectedPostId(null);
    if (refresh) {
      fetchUserData();
    }
  };

  const handlePostCreated = () => {
    setShowCreatePost(false);
    fetchUserData();
  };

  return (
    <div style={{ minWidth: '100vw' }}>
      {/* Full width navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex flex-column w-100">
        <div className="container">
          <a className="navbar-brand" href="/">Sport Hub</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
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

      {/* Centered container for profile content */}
      <div className="container">
        <div className="bg-transparent py-4">
          {/* Profile Info Section */}
          <div className="d-flex align-items-center mb-4 position-relative">
            <div className="profile-pic-container">
              <img
                src={isGoogleUser ? googleAvatar : (profileImage || "https://via.placeholder.com/150")}
                className="rounded-circle profile-pic"
                alt="User Avatar"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              {!isGoogleUser && (
                <>
                  <input type="file" id="profileImageUpload" className="d-none" onChange={handleImageChange} />
                  <label htmlFor="profileImageUpload" className="camera-icon">
                    <i className="bi bi-camera-fill"></i>
                  </label>
                </>
              )}
            </div>
            <div className="ms-4">
              <h3 className="text-dark">{user.UserName}</h3>
              <div className="d-flex align-items-center mb-2">
                <Link to="/EditProfile" className="btn btn-outline-primary me-2">Edit Profile</Link>
                <Link to="/Settings" className="btn btn-outline-secondary">
                  <i className="bi bi-gear"></i>
                </Link>
              </div>
              <div className="d-flex mb-2">
                <div className="me-4">
                  <h4 className="text-dark">Posts</h4>
                  <p className="text-dark">{posts.length}</p>
                </div>
                <div>
                  <h4 className="text-dark">Friends</h4>
                  <p className="text-dark">{friendsCount}</p>
                </div>
              </div>
              <p className="text-dark">{user.Bio}</p>
            </div>
          </div>

          {/* Posts Grid Section */}
          <div>
            <h4 className="text-dark mb-4">Posts</h4>
            <div className="row g-4">
              {posts.length > 0 ? (
                posts.map(post => (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={post.id} onClick={() => handlePostClick(post.id)}>
                    <div className="card bg-transparent border-0" style={{ cursor: 'pointer' }}>
                      <div style={{ paddingBottom: '100%', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                          {renderMedia(post.PostPath)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-dark">No hay Posts disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </div>

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
