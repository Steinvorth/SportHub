import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PostCards } from './PostCards';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Global.css';
import logo from "./main_logo.png";
import supabase from '../supabase/supabase';
import { getRole, getRoleName, addUsuario, SetRole, getUsuarioByUUID } from '../supabase/api';
import { CreatePost } from '../PostCreation/CreatePost';
import { useNotifications } from '../Notificaciones/NotificationsProvider';
import { subscribeToFriendRequests } from '../supabase/apiRealtime';

// Componente principal de la página de inicio
export const HomePage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  const [authToken, setAuthToken] = useState(localStorage.getItem('user'));
  const [userIdToken, setUserIdToken] = useState(localStorage.getItem('userId'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [postType, setPostType] = useState('explorar');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // verificar la autenticación
  useEffect(() => {
    const checkAuthentication = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          const userUUID = session.user.id;
          const accessToken = session.access_token;
          
          localStorage.setItem('user', JSON.stringify(accessToken));
          localStorage.setItem('userId', JSON.stringify(userUUID));
          setAuthToken(accessToken);
          setUserIdToken(userUUID);

          const userExists = await getUsuarioByUUID(userUUID);
          if (!userExists) {
            await addUsuario(userUUID, session.user.email);
            await SetRole(userUUID);
          }

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
  }, []);

  // verificar autenticación al mostrar posts de amigos
  useEffect(() => {
    if (postType === 'amigos' && !userIdToken) {
      navigate('/login');
    }
  }, [postType, userIdToken, navigate]);

  // mostrar botón de desplazamiento hacia arriba
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add subscription to friend requests
  useEffect(() => {
    if (userIdToken) {
      const unsubscribe = subscribeToFriendRequests((message) => {
        showNotification(message);
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [userIdToken, showNotification]);

  // Add this near the top with other useEffects
  useEffect(() => {
    if (userIdToken) {
      console.log('Setting up friend request subscription for user:', userIdToken);
      const unsubscribe = subscribeToFriendRequests((message) => {
        console.log('Notification received:', message);
        showNotification(message);
      });
      
      return () => {
        console.log('Cleaning up friend request subscription');
        unsubscribe();
      };
    }
  }, [userIdToken, showNotification]);

  // Función para cerrar sesión
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

  // Función para desplazarse hacia arriba
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Maneja la creación de un nuevo post
  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowCreatePost(false);
  };

  return (
    <div className="d-flex">
      {/* Barra lateral izquierda */}
      <div className="sidebar bg-primary text-white d-flex flex-column p-3" style={{ width: '220px', height: '100vh' }}>
        <img
          src={logo}
          alt="Logo"
          className="logo mx-4 mb-3"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setPostType('explorar');
            navigate('/login');
          }}
        />
        <h3 className="text-center">Sport Hub</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className="nav-link text-white" onClick={() => setPostType('explorar')}>
              <i className="bi bi-backpack2"></i> Explorar
            </Link>
          </li>
          
          {authToken && (
            <li className="nav-item">
              <Link to="/" className="nav-link text-white" onClick={() => setPostType('amigos')}>
                <i className="bi bi-people"></i> Amigos
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/Search" className="nav-link text-white" onClick={() => setPostType('explorar')}>
              <i className="bi bi-search"></i> Buscar
            </Link>
          </li>

          {authToken && (
            <li className="nav-item">
            <a className="nav-link text-white" style={{cursor: 'pointer'}} onClick={() => setShowCreatePost(true)}>
              <i className="bi bi-pencil-square"></i> Crear
            </a>
          </li>
          )}          
          {authToken && (
            <li className="nav-item">
              <Link to="/logout" className="nav-link text-white" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i> Cerrar sesión
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
              <PostCards postType={postType} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>

      {/* Barra lateral derecha */}
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
                <Link to="/Friends" className="nav-link text-white">
                  <i className="bi bi-person-lines-fill"></i> Manejar Amistades
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

      {/* Botón de desplazamiento hacia arriba */}
      {showScrollButton && (
        <div className="scroll-to-top-fixed">
          <button onClick={scrollToTop} className="btn btn-primary">
            ↑
          </button>
        </div>
      )}
      <CreatePost 
        show={showCreatePost} 
        handleClose={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Fondo del modal */}
      {showCreatePost && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowCreatePost(false)}
        ></div>
      )}
    </div>    
  );
};
