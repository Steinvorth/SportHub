import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PostCards } from './PostCards';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Global.css';
import logo from "./main_logo.png";
import supabase from '../supabase/supabase';
import { getRole, getRoleName, addUsuario, SetRole, getUsuarioByUUID } from '../supabase/api';

export const HomePage = () => {
  const navigate = useNavigate();

  const [authToken, setAuthToken] = useState(localStorage.getItem('user'));
  const [userIdToken, setUserIdToken] = useState(localStorage.getItem('userId'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [postType, setPostType] = useState('explorar');
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          const userUUID = session.user.id;
          const accessToken = session.access_token;
          
          // Store user authentication data
          localStorage.setItem('user', JSON.stringify(accessToken));
          localStorage.setItem('userId', JSON.stringify(userUUID));
          setAuthToken(accessToken);
          setUserIdToken(userUUID);

          // Check if user exists in our database
          const userExists = await getUsuarioByUUID(userUUID);
          if (!userExists) {
            // If it's a new user, add them to our database
            await addUsuario(userUUID, session.user.email);
            await SetRole(userUUID);
          }

          // Get and store user role
          const roleData = await getRole(userUUID);
          if (roleData) {
            const roleNameData = await getRoleName(roleData.IdRole);
            localStorage.setItem('userRole', roleNameData.Rol);
            setUserRole(roleNameData.Rol);
          }
        } catch (error) {
          console.error('Error processing authentication:', error);
        }
      }
    };

    checkAuthentication();
  }, []); // Empty dependency array since we only want this to run once on mount

  useEffect(() => {
    if (postType === 'amigos' && !userIdToken) {
      navigate('/login');
    }
  }, [postType, userIdToken, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300); // Muestra el botón después de 300px de desplazamiento
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sb-uxiytxuyozhaolqjauzv-auth-token');
    setAuthToken(null);
    setUserIdToken(null);
    setUserRole(null);
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="d-flex">
      {/* Sidebar - Lado izquierdo */}
      <div className="sidebar bg-primary text-white d-flex flex-column p-3" style={{ width: '220px', height: '100vh' }}>
        {/* Logo que redirige a la página principal */}
        <img
          src={logo}
          alt="Logo"
          className="logo mx-4 mb-3"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <h3 className="text-center">Sport Hub</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className="nav-link text-white">
              <i className="bi bi-house-door"></i> Explorar
            </Link>
          </li>
          
          <li className="nav-item">
            <Link to="/explorar" className="nav-link text-white" onClick={() => setPostType('explorar')}>
              <i class="bi bi-people-fill"></i> Amigos
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/Search" className="nav-link text-white" onClick={() => setPostType('explorar')}>
              <i className="bi bi-search"></i> Buscar
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/create" className="nav-link text-white">
              <i className="bi bi-pencil-square"></i> Crear
            </Link>
          </li>
          {authToken && (
            <li className="nav-item">
              <Link to="/" className="nav-link text-white" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i> Cerrar sesión
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
              <PostCards postType={postType} />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Derecho */}
      <div className="right sidebar bg-primary text-white d-flex flex-column p-3" style={{ width: '220px', height: '100vh' }}>
        <h3 className="text-center">Opciones</h3>
        <ul className="nav flex-column">
          {authToken ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-link text-white">
                  <i className="bi bi-person-circle"></i> Perfil
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/posts" className="nav-link text-white">
                  <i className="bi bi-file-earmark-post"></i> Posts
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/saved" className="nav-link text-white">
                  <i className="bi bi-bookmark"></i> Guardados
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/liked" className="nav-link text-white">
                  <i className="bi bi-heart"></i> Me gusta
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link text-white">
                  <i className="bi bi-gear"></i> Configuración
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link text-white">
                <i className="bi bi-box-arrow-in-right"></i> Iniciar sesión
              </Link>
            </li>
          )}
          {userRole === 'Admin' && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link text-white">
                <i className="bi bi-speedometer2"></i> Admin
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Botón flotante para volver al inicio */}
      {showScrollButton && (
        <div className="scroll-to-top-fixed">
          <button onClick={scrollToTop} className="btn btn-primary">
            ↑
          </button>
        </div>
      )}
    </div>
  );
};
