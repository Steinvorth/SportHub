import React, { useState } from 'react';
import supabase from '../supabase/supabase';

export const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false); //controlamos si se selecciona sign up o login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        //guardamos el access token de Supabase
        localStorage.setItem('user', JSON.stringify(data.session.access_token));

        //guardamos el uuid del usuario
        localStorage.setItem('userId', JSON.stringify(data.user.id));

        setMessage('Account created successfully');
        onLoginSuccess(); // Mandamos devuelta al home
      } else {
        // Log in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error){
          setError(error.message);
          throw error;
        }

        //guardamos el access token de Supabase
        localStorage.setItem('user', JSON.stringify(data.session.access_token));

        //guardamos el uuid del usuario
        localStorage.setItem('userId', JSON.stringify(data.user.id));

        setMessage('Logged in successfully!');
        onLoginSuccess(); // Mandamos devuelta al home
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center">{isSignUp ? 'Create Account' : 'Login'}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleAuth}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <div className="text-center mt-3">
        <button
          type="button"
          className="btn btn-link"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
};
