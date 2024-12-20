import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../HomePage/main_logo.png';

export const Suspended = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }} className="d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <img
                  src={logo}
                  alt="Sport Hub Logo"
                  className="mb-4"
                  style={{ width: '200px' }}
                />
                <div className="text-primary mb-4">
                  <i className="bi bi-shield-lock-fill" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="text-dark mb-4">Cuenta Suspendida</h2>
                <p className="text-secondary mb-4">
                  Tu cuenta ha sido suspendida por violar nuestras políticas de comunidad. 
                  Si crees que esto es un error, por favor contáctanos.
                </p>
                <div className="mb-4">
                  <p className="text-primary">
                    <i className="bi bi-envelope me-2"></i>
                    support@sporthub.com
                  </p>
                </div>
                <Link to="/" className="btn btn-primary">
                  <i className="bi bi-house-door me-2"></i>
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};