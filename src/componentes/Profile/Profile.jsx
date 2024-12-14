import React, { useEffect, useState } from 'react';
import { getUsuarioByUUID, getPostsByUser, getFriendsCount, uploadUserProfileImage } from '../supabase/api';
import { Link } from 'react-router-dom';
import './Profile.css'; // Import the CSS file

export const Profile = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);

  const userId = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUsuarioByUUID(userId);
      setUser(userData);
      setProfileImage(userData.ProfilePic ? `data:image/png;base64,${userData.ProfilePic}` : null);

      const userPosts = await getPostsByUser(userId);
      setPosts(userPosts);

      const userFriendsCount = await getFriendsCount(userId);
      setFriendsCount(userFriendsCount);
    };

    fetchUserData();
  }, [userId]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await uploadUserProfileImage(userId, file);
      setProfileImage(`data:image/png;base64,${base64String}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Profile</h2>
          <Link to="/settings" className="btn btn-outline-secondary">Settings</Link>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mb-4 position-relative">
            <div className="profile-pic-container">
              <img 
                src={profileImage || "https://via.placeholder.com/100"} 
                className="rounded-circle profile-pic" 
                alt="User Avatar" 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
              />
              <input type="file" id="profileImageUpload" className="d-none" onChange={handleImageChange} />
              <label htmlFor="profileImageUpload" className="camera-icon">
                <i className="bi bi-camera-fill"></i>
              </label>
            </div>
            <div>
              <h3>{user.UserName}</h3>
              <p>{user.Bio}</p>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-4">
            <div>
              <h4>Posts</h4>
              <p>{posts.length}</p>
            </div>
            <div>
              <h4>Friends</h4>
              <p>{friendsCount}</p>
            </div>
          </div>
          <div>
            <h4>User Posts</h4>
            {posts.length > 0 ? (
              posts.map(post => (
                <div className="card mb-3" key={post.id}>
                  <div className="card-body">
                    <p>{post.Descripcion}</p>
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
  );
};
