import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getPostsPublicos, getRole, getRoleName } from '../supabase/api';

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
    <div className="container mt-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Admin Dashboard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Usuarios</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Posts</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>Comentarios</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'users' && (
          <div>
            <h3>Usuarios</h3>
            {/* Aquí puedes agregar el código para mostrar la lista de usuarios */}
          </div>
        )}
        {activeTab === 'posts' && (
          <div>
            <h3>Posts</h3>
            <div className="list-group">
              {posts.map(post => (
                <div key={post.id} className="list-group-item">
                  <h5>{post.Descripcion}</h5>
                  <p>{post.Privacidad ? 'Privado' : 'Público'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'comments' && (
          <div>
            <h3>Comentarios</h3>
            {/* Aquí puedes agregar el código para mostrar la lista de comentarios */}
          </div>
        )}
      </div>
    </div>
  );
};
