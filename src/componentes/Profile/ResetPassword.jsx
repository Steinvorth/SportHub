import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabase/supabase';

export const ResetPassword = () => {
  const [type, setType] = useState('password');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleType = () => {
    setType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  const PasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error('Error updating password:', error.message);
        alert('Error updating password');
      } else {
        console.log('Password updated successfully:', data);
        alert('Password updated successfully');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex flex-column">
        <div className="container">
          <Link to="../Settings">
            <i className="bi bi-arrow-bar-left me-3 text-dark fs-4"></i>
          </Link>
          <a className="navbar-brand" href="/">Sport Hub</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto"></ul>
          </div>
        </div>
      </nav>

      {/* Password Reset Form */}
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="mb-4">Password Reset</h1>
        <form className="w-100" style={{ maxWidth: '400px' }} onSubmit={PasswordReset}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type={type}
              className="form-control"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type={type}
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <p
            onClick={toggleType}
            className="text-decoration-underline"
            style={{ cursor: 'pointer', display: 'inline' }}
          >
            {type === 'password' ? 'Mostrar' : 'Ocultar'} Contraseña
          </p>
          <hr />
          <button type="submit" className="btn btn-primary w-100">Reset Password</button>
        </form>
      </div>
    </>
  );
};
