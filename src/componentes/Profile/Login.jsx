import React, { useState } from 'react';
import supabase from '../supabase/supabase';
import { addUsuario } from '../supabase/api';

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

        //agregamos el usuario a la tabla Usuarios
        await addUsuario(data.user.id, email);

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

        console.log(data);

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

    <div            //centrado y alineamiento de divisiones y fondo
  className="d-flex align-items-center"
  style={{
    height: '100vh',
    backgroundColor: '#181A1B',
    gap: '10px',
  }}
>
  
  <div            //Diseño espaciado y centrado de la imagen del login
    style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '400px',
    }}
  >
    <img          //Diseño del tamaño de la imagen
      src="Images/LoginIMG.png"
      alt="Imagen Login"
      style={{
        maxWidth: '525px',
        maxHeight: '525px',
      }}
    />
  </div>

  <div                          //Diseño del formulario LogIn/SignUp
  className="container mt-5"
  style={{
    flex: 1,
    maxWidth: '400px',
    backgroundColor: '#202124',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    color: '#FFF',
    marginRight: '350px',
  }}
>
  <h2
    className="text-center"
    style={{
      color: '#4A90E2',
      fontWeight: '700',
      marginBottom: '20px',
      fontSize: '1.8rem',
    }}
  >
    {isSignUp ? 'Create Account' : 'Login'}
  </h2>

  {error && (
    <div
      className="alert alert-danger"
      style={{
        color: '#000000',
        fontWeight: 'bold',

    
      }}
    >
      {error}
    </div>
  )}
  {message && (
    <div
      className="alert alert-success"
      style={{
        color: '#5cb85c',
        fontWeight: 'bold',
      }}
    >
      {message}
    </div>
  )}

  <form onSubmit={handleAuth}>
    <div className="mb-3">
      <label
        htmlFor="email"
        className="form-label"
        style={{
          color: '#B0B3B8',
          fontWeight: 'bold',
        }}
      >
        Email address
      </label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#3A3B3C',
          borderRadius: '8px',
          border: '1px solid #4A4B4C',
          padding: '10px',
        }}
      >
        <img
          className="material-icons"
          src= "Images/Mail_materialIcons.png"
          style={{
            color: '#B0B3B8',
            marginRight: '10px',
            maxWidth:'30px',
            maxHeight:'30px'
          }}
        >
          
        </img>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: '#FFF',
            outline: 'none',
            flex: 1,
          }}
        />
      </div>
    </div>


    <div className="mb-3">
      <label
        htmlFor="password"
        className="form-label"
        style={{
          color: '#B0B3B8',
          fontWeight: 'bold',
        }}
      >
        Password
      </label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#3A3B3C',
          borderRadius: '8px',
          border: '1px solid #4A4B4C',
          padding: '10px',
        }}
      >
        <img
          className="material-icons"
          src= "Images/PassW_materialIcons.png"
          style={{
            color: '#000000',
            marginRight: '10px',
            maxWidth:'30px',
            maxHeight:'30px'
          }}
        >
          
        </img>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: '#FFF',
            outline: 'none',
            flex: 1,
          }}
        />
      </div>
    </div>

    <button
      type="submit"
      className="btn btn-primary w-100"
      style={{
        backgroundColor: '#4A90E2',
        borderColor: '#4A90E2',
        borderRadius: '8px',
        fontWeight: 'bold',
        padding: '10px',
        transition: 'transform 1s ease, background-color 1s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#357ABD';
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#4A90E2';
        e.target.style.transform = 'scale(1)';
      }}
    >
      {isSignUp ? 'Sign Up' : 'Login'}
    </button>
  </form>

  <div className="text-center mt-3">
    <button
      type="button"
      className="btn btn-link"
      onClick={() => setIsSignUp(!isSignUp)}
      style={{
        color: '#4A90E2',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.color = '#357ABD')}
      onMouseLeave={(e) => (e.target.style.color = '#4A90E2')}
    >
      {isSignUp ? 'Ya tienes cuenta? Inicia sesion!' : "No tienes Cuenta? Inscribete!"}
    </button>
  </div>
</div>
</div>
  );
};
