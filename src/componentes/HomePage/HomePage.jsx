import React, { useEffect } from 'react';
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
              <li className="nav-item">
                <Link to="/login" className="btn btn-outline-primary">
                  <i className="bi bi-person-circle"></i> Login / Sign Up
                </Link>
              </li>
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
