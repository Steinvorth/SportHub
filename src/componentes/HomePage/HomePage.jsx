import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostCards } from './PostCards';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons

/*
 * Este es el Home Page de La red Social, como por decir cuando uno abre Instagram.
*/

export const HomePage = () => {

    //use Effect para traer todos los posts de publicos de la base de datos.
    // useEffect(() => {
    //   first
    
    //   return () => {
    //     second
    //   }
    // }, [third])

    //use state para manejar el auth token
    var authUserToken = localStorage.getItem('user');
    const [authToken, SetAuthToken] = useState(authUserToken);   

    //User UUID para poder hacer el crud relacionado a la cuenta
    var userId = localStorage.getItem('userId');
    const [userIdToken, SetUserIdToken] = useState(userId);

    //use state para manejar el link de login, si hay auth token, vamos al perfil. Si no, vamos a login/sign up.
    const [loginLink, setLoginLink] = useState(authToken === null ? '/login' : '/profile');

    //funcion para hacer el logout, solamente borramos el token y userId de la local storage.
    const logout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      SetAuthToken(null);
      SetUserIdToken(null);
    }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/">My Social App</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item ms-2">
                <Link to={loginLink} className="btn btn-outline-primary">
                  <i className="bi bi-person-circle"></i> { authToken === null ? 'Login / Sign Up' : 'Profile' }
                </Link>
              </li>
              
              {/* si tenemos un auth token, entonces mostramos el logout. Si no, entonces esta escondido. */}
              {authToken && (
                <li className="nav-item ms-2">
                  <button className="btn btn-outline-primary" onClick={logout}>
                    <i className="bi bi-box-arrow-right"></i>
                  </button>                  
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        <h1>Home Page</h1>
      </div>
      
      <div className="container d-flex justify-content-center">
        <PostCards />
      </div>
    </>
  );
};
