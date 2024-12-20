import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchPosts, searchUsers } from '../supabase/api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SearchPost } from './SearchPost';  // Update import

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const EmptyState = ({ message }) => (
    <div className="text-center p-5" style={{ color: '#6c757d' }}>
      <i className="bi bi-search mb-3" style={{ fontSize: '2rem' }}></i>
      <p className="mb-0">{message}</p>
    </div>
  );

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPostId(null);
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      minWidth: '100vw'
    }}>
      <div style={{ padding: '20px', minWidth: '100vw' }}>
        {/* Search Bar */}
        <div className="card mb-4" style={{ 
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: 'none',
          borderRadius: '12px',
          width: '100%'
        }}>
          <div className="card-body">
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
                placeholder="Search posts and users..."
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

        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Users Section - Horizontal Scroll */}
            <div className="card mb-4" style={{ 
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: 'none',
              borderRadius: '12px',
              width: '100%'
            }}>
              <div className="card-body">
                <h4 className="mb-4" style={{ color: '#212529', fontWeight: '600' }}>Users</h4>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <div style={{ 
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1rem'  // Space for scrollbar
                  }}>
                    {users.length > 0 ? users.map(user => (
                      <div key={user.User_Auth_Id} style={{ minWidth: '250px' }}>
                        <Link to={`/profile/${user.User_Auth_Id}`} className="text-decoration-none">
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
                        </Link>
                      </div>
                    )) : (
                      <EmptyState message={searchTerm ? "No users found" : "Search for users"} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Section - Vertical Scroll */}
            <div className="card" style={{ 
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: 'none',
              borderRadius: '12px',
              width: '100%',
              height: '450px'  // Fixed height
            }}>
              <div className="card-body" style={{ flex: 'none' }}>
                <h4 style={{ color: '#212529', fontWeight: '600' }}>Posts</h4>
              </div>
              <div style={{ 
                overflowY: 'auto',
                padding: '0 1.25rem 1.25rem',
                height: 'calc(100% - 70px)'  // Subtract header height
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
                        height: '300px'  // Fixed height for 4:3 ratio
                      }}>
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          {renderMedia(post.PostPath)}
                        </div>
                        <div className="card-body p-2">
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
                      <EmptyState message={searchTerm ? "No posts found" : "Search for posts"} />
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
    </div>
  );
};