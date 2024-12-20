import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getRole, getRoleName } from '../supabase/api';
import { AdminUsuarios } from './AdminUsuarios';

export const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'Admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }      
    };

    const fetchPosts = async () => {
      const postsData = await getPosts();
      setPosts(postsData);
    };

    fetchUserRole();
    fetchPosts();
  }, []);

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <h2>Usuario no permitido en esta ruta. Por favor volver a la pagina de inicio</h2>
        <Link to="/" className="btn btn-primary mt-3">Volver a la página de inicio</Link>
      </div>
    );
  }

  return (
    <div style={{ minWidth: '100vw', backgroundColor: '#f8f9fa' }}>
      <div className="container mt-5">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand text-dark">Admin Dashboard</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <button className={`nav-link text-dark ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Usuarios</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link text-dark ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Posts</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="mt-4">
          {activeTab === 'users' && (
            <AdminUsuarios />
          )}
          {activeTab === 'posts' && (
            <div>
              <h3 className="text-dark">Posts</h3>
              <div className="list-group">
                {posts.map(post => (
                  <div key={post.id} className="list-group-item bg-white d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="text-dark">{post.Descripcion}</h5>
                      <p className="text-secondary">{post.Privacidad ? 'Privado' : 'Público'}</p>
                    </div>
                    <Link to={`/admin/review/${post.id}`} className="btn btn-primary">Revisar</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
