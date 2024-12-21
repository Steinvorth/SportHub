import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsuarioByUUID, getPostsByUser, getFriendsCount, uploadUserProfileImage, getFriends } from '../supabase/api';
import './Profile.css';
import { DetallePost } from './DetallePost';

export const ProfileComponent = ({ onPostClick, targetUserUUID, refreshTrigger }) => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [googleAvatar, setGoogleAvatar] = useState(null);
  const [canViewPosts, setCanViewPosts] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const currentUserUUID = JSON.parse(localStorage.getItem('userId'));

  // verificar si el usuario ha iniciado sesión con Google
  useEffect(() => {
    const googleAuthToken = localStorage.getItem('sb-uxiytxuyozhaolqjauzv-auth-token');
    if (googleAuthToken) {
      try {
        const parsedToken = JSON.parse(googleAuthToken);
        const avatarUrl = parsedToken.user?.user_metadata?.avatar_url || 
                         parsedToken.user?.user_metadata?.picture;
        
        console.log('Google auth data:', {
          metadata: parsedToken.user?.user_metadata,
          avatarUrl
        });

        if (avatarUrl) {
          setIsGoogleUser(true);
          setGoogleAvatar(avatarUrl);
        }
      } catch (error) {
        console.error('Error parsing Google auth token:', error);
      }
    }
  }, []);

  //para verificar permisos y obtener datos del usuario
  useEffect(() => {
    const checkPermissionsAndFetchData = async () => {
      const userData = await getUsuarioByUUID(targetUserUUID);
      setUser(userData);
      
      if (!isGoogleUser) {
        setProfileImage(userData.ProfilePic ? `data:image/png;base64,${userData.ProfilePic}` : null);
      }

      const userFriendsCount = await getFriendsCount(targetUserUUID);
      setFriendsCount(userFriendsCount);

      // Verificar permisos
      if (currentUserUUID === targetUserUUID) {
        setCanViewPosts(true);
        const userPosts = await getPostsByUser(targetUserUUID);
        setPosts(userPosts);
        return;
      }

      // Si el perfil es público
      if (!userData.PerfilPrivado) {
        setCanViewPosts(true);
        const userPosts = await getPostsByUser(targetUserUUID);
        setPosts(userPosts);
        return;
      }

      // Si el perfil es privado, verificar amistad
      const friends = await getFriends(currentUserUUID);
      const isFriend = friends.some(friend => friend.User_Auth_Id === targetUserUUID);
      setCanViewPosts(isFriend);
      
      if (isFriend) {
        const userPosts = await getPostsByUser(targetUserUUID);
        setPosts(userPosts);
      }
    };

    checkPermissionsAndFetchData();
  }, [targetUserUUID, currentUserUUID, isGoogleUser, refreshTrigger]); // Add refreshTrigger

  // Maneja el cambio de imagen de perfil
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await uploadUserProfileImage(currentUserUUID, file);
      setProfileImage(`data:image/png;base64,${base64String}`);
    }
  };

  // Renderiza el contenido multimedia (imagen o video) del post
  const renderMedia = (postPath) => {
    const fileExtension = postPath.split('.').pop().toLowerCase();
    if (fileExtension === 'mp4') {
      return (
        <video className="card-img-top" controls={false} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src={postPath} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      );
    } else {
      return <img src={postPath || "https://via.placeholder.com/150"} className="card-img-top" alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
  };

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setShowPostModal(true);
  };

  // En el retorno, actualizar los comentarios y textos
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #fff',
                marginRight: '20px',
                position: 'relative',
              }}
            >
              <img
                src={isGoogleUser ? googleAvatar : profileImage || 'https://via.placeholder.com/150'}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {currentUserUUID === targetUserUUID && !isGoogleUser && (
                <>
                  <input
                    type="file"
                    id="profileImageUpload"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="profileImageUpload"
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      padding: '5px',
                      borderRadius: '50%',
                    }}
                  >
                    <i className="bi bi-camera-fill" style={{ color: '#000' }}></i>
                  </label>
                </>
              )}
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{user.UserName}</h2>
              <div style={{ marginTop: '10px' }}>
                {currentUserUUID === targetUserUUID && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/EditProfile" className="btn btn-outline-light">
                      Editar Perfil
                    </Link>
                    <Link to="/Settings" className="btn btn-outline-light">
                      <i className="bi bi-gear"></i>
                    </Link>
                    <Link to="/Friends" className="btn btn-outline-light">
                      <i className="bi bi-people"></i>
                    </Link>
                  </div>
                )}
              </div>
              <p style={{ margin: '5px 0' }}>
                Posts: {posts.length} | Friends: {friendsCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '20px', color: '#000' }}>Posts</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onClick={() => handlePostClick(post.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
              }}
            >
              {renderMedia(post.PostPath)}
            </div>
          ))}
        </div>
      </div>

      {showPostModal && (
        <DetallePost
          postId={selectedPostId}
          show={showPostModal}
          handleClose={() => setShowPostModal(false)}
        />
      )}
    </div>
  );
};