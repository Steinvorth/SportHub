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
