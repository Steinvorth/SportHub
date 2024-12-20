import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsuarioByUUID, getPostsByUser, getFriendsCount, uploadUserProfileImage } from '../supabase/api';
import './Profile.css';

export const ProfileComponent = ({ onPostClick }) => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [googleAvatar, setGoogleAvatar] = useState(null);

  const userUUID = JSON.parse(localStorage.getItem('userId'));

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
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={post.id} onClick={() => onPostClick(post.id)}>
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
  );
};