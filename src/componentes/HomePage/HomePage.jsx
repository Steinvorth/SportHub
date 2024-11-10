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
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex flex-column">
        <div className="container">
          <a className="navbar-brand" href="/">Sport Hub</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
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

      {/* Barra Para toggle Content entre Following, Explorar y Amigos */}
      <div className="container mt-3 d-flex justify-content-center w-50">
        <div className="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
          <label className="btn btn-primary flex-fill text-center" htmlFor="btnradio1">Explorar</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
          <label className="btn btn-primary flex-fill text-center" htmlFor="btnradio2">Amigos</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
          <label className="btn btn-primary flex-fill text-center" htmlFor="btnradio3">Eventos</label>
        </div>
      </div>

      {/* Dependiendo de lo que se seleccione, se van a mostrar los Posts de Amigos,
          De todos los que usen el app, o eventos publicados */}

      {/* Main Content - Home Feed */}   
      <div className="container d-flex justify-content-center mt-3 ">
        <div className='col-12 col-md-6'>
          <PostCards />
        </div>
        
      </div>
    </>
  );
};
