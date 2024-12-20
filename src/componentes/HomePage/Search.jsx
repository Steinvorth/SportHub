import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchPosts, searchUsers } from '../supabase/api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SearchPost } from './SearchPost';  
import { SearchProfile } from './SearchProfile';  

// Componente de búsqueda para posts y usuarios
export const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);  
  const [showProfileModal, setShowProfileModal] = useState(false);  

  // realizar la búsqueda cuando cambia el término
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim().length < 1) {
        setPosts([]);
        setUsers([]);
        return;
      }

      setLoading(true);
      const [postsResults, usersResults] = await Promise.all([
        searchPosts(searchTerm),
        searchUsers(searchTerm)
      ]);
      
      setPosts(postsResults);
      setUsers(usersResults);
      setLoading(false);
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Renderiza las imágenes o videos de los posts
  const renderMedia = (postPath) => {
    if (!postPath) return null;
    const fileExtension = postPath.split('.').pop().toLowerCase();
    if (fileExtension === 'mp4') {
      return (
        <video className="img-fluid rounded" style={{ maxHeight: '200px' }}>
          <source src={postPath} type="video/mp4" />
        </video>
      );
    }
    return <img src={postPath} alt="Post" className="img-fluid rounded" style={{ maxHeight: '200px' }} />;
  };

  // Componente para mostrar cuando no hay resultados
  const EmptyState = ({ message }) => (
    <div className="text-center p-5" style={{ color: '#6c757d' }}>
      <i className="bi bi-search mb-3" style={{ fontSize: '2rem' }}></i>
      <p className="mb-0">{message}</p>
    </div>
  );

  // Maneja el clic en un post para abrir el modal
  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setShowModal(true);
  };

  // Cierra el modal de post
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPostId(null);
  };

  // Maneja el clic en un perfil de usuario para abrir el modal
  const handleProfileClick = (userId) => {  
    setSelectedUserId(userId);
    setShowProfileModal(true);
  };

  // Cierra el modal de perfil de usuario
  const handleCloseProfileModal = () => {  
    setShowProfileModal(false);
    setSelectedUserId(null);
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
    }}>
      <div style={{ padding: '20px', minWidth: '100vw', maxWidth: '100vw' }}>
        {/* Barra de búsqueda */}
        <div className="card mb-4" style={{ 
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: 'none',
          borderRadius: '12px',
          width: '100%'
        }}>
          <div className="card-body">
            <div className="d-flex align-items-center">
              <Link 
                to="/" 
                className="btn btn-outline-light me-3"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                  padding: '12px 15px'
                }}
              >
                <i className="bi bi-chevron-left" style={{ fontSize: '1.2rem', color: '#495057', textAlign:'center'}}></i>
              </Link>
              
              <div className="col-md-9">
                <div className="input-group">
                  <span className="input-group-text" style={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e9ecef',
                    borderRight: 'none',
                    color: '#495057'
                  }}>
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar posts y usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      backgroundColor: '#fff',
                      color: '#212529',
                      fontSize: '1.1rem',
                      padding: '15px',
                      border: '1px solid #e9ecef',
                      borderLeft: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Sección de usuarios - Scroll horizontal */}
            <div className="card mb-4" style={{ 
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: 'none',
              borderRadius: '12px',
              width: '100%'
            }}>
              <div className="card-body">
                <h4 className="mb-4" style={{ color: '#212529', fontWeight: '600' }}>Usuarios</h4>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <div style={{ 
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1rem'
                  }}>
                    {users.length > 0 ? users.map(user => (
                      <div key={user.User_Auth_Id} style={{ minWidth: '250px' }}>
                        <div onClick={() => handleProfileClick(user.User_Auth_Id)} className="text-decoration-none">
                          <div className="card h-100" style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center">
                                <div style={{ 
                                  width: '60px', 
                                  height: '60px', 
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  marginRight: '15px',
                                  flexShrink: 0,
                                  border: '2px solid #e9ecef'
                                }}>
                                  <img
                                    src={user.ProfilePic ? `data:image/png;base64,${user.ProfilePic}` : "https://via.placeholder.com/60"}
                                    alt="Profile"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                  <h6 className="mb-0" style={{ 
                                    color: '#212529',
                                    fontSize: '1rem',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                  }}>@{user.UserName}</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <EmptyState message={searchTerm ? "No se encontraron usuarios" : "Busca usuarios"} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de posts - Scroll vertical */}
            <div className="card" style={{ 
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: 'none',
              borderRadius: '12px',
              width: '100%',
              height: '450px'
            }}>
              <div className="card-body" style={{ flex: 'none' }}>
                <h4 style={{ color: '#212529', fontWeight: '600' }}>Posts</h4>
              </div>
              <div style={{ 
                overflowY: 'auto',
                padding: '0 1.25rem 1.25rem',
                height: 'calc(100% - 70px)'
              }}>
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3">
                  {posts.length > 0 ? posts.map(post => (
                    <div key={post.id} className="col" onClick={() => handlePostClick(post.id)}>
                      <div className="card h-100" style={{
                        backgroundColor: '#fff',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        height: '300px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: '100%',
                          height: '200px',
                          position: 'relative'
                        }}>
                          {post.PostPath && (
                            post.PostPath.split('.').pop().toLowerCase() === 'mp4' ? (
                              <video 
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              >
                                <source src={post.PostPath} type="video/mp4" />
                              </video>
                            ) : (
                              <img 
                                src={post.PostPath} 
                                alt="Post" 
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              />
                            )
                          )}
                        </div>
                        <div className="card-body p-2" style={{
                          width: '100%'
                        }}>
                          <h6 className="card-subtitle mb-1" style={{ 
                            color: '#495057',
                            fontSize: '0.9rem'
                          }}>
                            @{post.Usuarios.UserName}
                          </h6>
                          <p className="card-text" style={{ 
                            color: '#212529',
                            fontSize: '0.85rem',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            margin: 0
                          }}>{post.Descripcion}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-12">
                      <EmptyState message={searchTerm ? "No se encontraron posts" : "Busca posts"} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {selectedPostId && (
        <SearchPost
          postId={selectedPostId}
          show={showModal}
          handleClose={handleCloseModal}
        />
      )}
      {selectedUserId && (  
        <SearchProfile
          targetUserUUID={selectedUserId}
          show={showProfileModal}
          handleClose={handleCloseProfileModal}
        />
      )}
    </div>
  );
};