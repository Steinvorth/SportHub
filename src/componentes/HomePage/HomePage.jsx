import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostCards } from './PostCards';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons

/*
 * Este es el Home Page de La red Social, como por decir cuando uno abre Instagram.
*/

export const HomePage = () => {
  //use state para manejar el auth token
  var authUserToken = localStorage.getItem('user');
  const [authToken, SetAuthToken] = useState(authUserToken);   

  //User UUID para poder hacer el crud relacionado a la cuenta
  var userId = localStorage.getItem('userId');
  const [userIdToken, SetUserIdToken] = useState(userId);

  //use state para manejar el link de login, si hay auth token, vamos al perfil. Si no, vamos a login/sign up.
  const [loginLink, setLoginLink] = useState(authToken === null ? '/login' : '/profile');

  // Use state to manage the user role
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  // State to manage the selected post type
  const [postType, setPostType] = useState('explorar');

  //funcion para hacer el logout, solamente borramos el token y userId de la local storage.
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    SetAuthToken(null);
    SetUserIdToken(null);
    setUserRole(null);

    //refresh
    window.location.href = '/';
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex flex-column">
        <div className="container">
          <a className="navbar-brand" href="/">Sport Hub</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {authToken && (
                <li>
                  <Link to="/post" className="btn btn-outline-primary ms-2">
                    <i className="bi bi-card-image"></i>
                  </Link>
                </li>
              )}
              <li className="nav-item ms-2">
                <Link to={loginLink} className="btn btn-outline-primary">
                  <i className="bi bi-person-circle"></i> { authToken === null ? 'Login / Sign Up' : '' }
                </Link>
              </li>
              {authToken && (
                <li>
                  <Link to="/friends" className="btn btn-outline-primary ms-2">
                    <i className="bi bi-people-fill"></i>
                  </Link>
                </li>
              )}
              {authToken && (
                <li className="nav-item ms-2">
                  <button className="btn btn-outline-primary" onClick={logout}>
                    <i className="bi bi-box-arrow-right"></i>
                  </button>                  
                </li>                
              )}
              {userRole === 'Admin' && (
                <li className="nav-item ms-2">
                  <Link to="/admin" className="btn btn-outline-primary">
                    <i className="bi bi-speedometer2"></i> Administrar
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Barra Para toggle Content entre Following, Explorar y Amigos */}
      <div className="container mt-3 d-flex justify-content-center">
        <div className="btn-group col-12 col-md-6" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked onChange={() => setPostType('explorar')} />
          <label className="btn btn-primary flex-fill text-center" htmlFor="btnradio1">Explorar</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" onChange={() => setPostType('amigos')} />
          <label className="btn btn-primary flex-fill text-center" htmlFor="btnradio2">Amigos</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
          <label className="btn btn-primary flex-fill text-center" htmlFor="btnradio3">Eventos</label>
        </div>
      </div>

      {/* Main Content - Home Feed */}   
      <div className="container d-flex justify-content-center mt-3 ">
        <div className='col-12 col-md-6'>
          <PostCards postType={postType} />
        </div>
      </div>
    </>
  );
};
