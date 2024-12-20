import React, { useState, useEffect } from 'react';
import supabase from '../supabase/supabase';
import { addUsuario, SetRole, getRole, getRoleName, getUsuarioByUUID } from '../supabase/api';

export const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    //sign in google https://uxiytxuyozhaolqjauzv.supabase.co/auth/v1/authorize?provider=google

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        localStorage.setItem('user', JSON.stringify(data.session.access_token));
        localStorage.setItem('userId', JSON.stringify(data.user.id));

        await addUsuario(data.user.id, email);
        await SetRole(data.user.id);

        const roleData = await getRole(data.user.id);
        if (roleData) {
          const roleNameData = await getRoleName(roleData.IdRole);
          localStorage.setItem('userRole', roleNameData.Rol);
        }

        setMessage('Account created successfully');
        onLoginSuccess();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          throw error;
        }

        localStorage.setItem('userId', JSON.stringify(data.user.id));

        const roleData = await getRole(data.user.id);
        if (roleData) {
          const roleNameData = await getRoleName(roleData.IdRole);
          localStorage.setItem('userRole', roleNameData.Rol);
        }

        setMessage('Logged in successfully!');
        onLoginSuccess();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: window.location.origin // Redirects back to homepage after auth
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error during Google sign-in:', error.message);
      setError('Error during Google sign-in');
    }
  };

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
          }

          setMessage('Logged in successfully!');
          onLoginSuccess();
        } catch (error) {
          console.error('Error processing authentication:', error);
          setError('Error processing authentication');
        }
      }
    };

    // Run the authentication check
    checkAuthentication();
  }, [onLoginSuccess]); // Add onLoginSuccess to dependency array

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {/* Lado Izquierdo (Formulario + Logo) */}
      <div style={{ flex: 1, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
        
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '50px',
          width: '100%',
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <img src="/Logo.png" alt="SportHub Logo" style={{ width: '200px', marginBottom: '40px' }} />

          <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '2rem', fontWeight: '700', color: '#333' }}>
            {isSignUp ? 'Welcome Aboard' : 'Welcome Back'}
          </h2>

          {error && <div style={{ color: '#000', backgroundColor: '#f8d7da', padding: '10px', marginBottom: '15px', borderRadius: '4px', width: '100%', fontSize: '0.9rem' }}>{error}</div>}
          {message && <div style={{ color: '#000', backgroundColor: '#d1e7dd', padding: '10px', marginBottom: '15px', borderRadius: '4px', width: '100%', fontSize: '0.9rem' }}>{message}</div>}

          <form onSubmit={handleAuth} style={{ width: '100%' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                marginBottom: '15px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {/* Botón de Google en ambos modos (antes estaba condicionado a !isSignUp, ahora se muestra siempre) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#fff',
              color: '#000',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10px',
              fontSize: '1rem'
            }}
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google logo"
              style={{ marginRight: '10px' }}
            />
            Sign In with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: '#555' }}>
            <span>{isSignUp ? 'Already have an account?' : "Don't Have An Account?"}</span><br />
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer', margin: '5px 0', display: 'inline-block' }}
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </span>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Collage con más espacio y mayor brillo */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#1a1a1a', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))',
          gap: '40px',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          padding: '20px'
        }}>
          {/* Imágenes en el orden especificado */}
          <img src="/volleyball.jpg" alt="Volleyball" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover',
            height: 'auto'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/tennis.jpg" alt="Tennis" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover',
            height: 'auto'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/nadal.jpg" alt="Nadal" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover',
            height: 'auto'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/ski.jpg" alt="Ski" style={{ 
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }} 
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/boxing.jpg" alt="Boxing" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/pele.jpg" alt="Pele" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/bike.jpg" alt="Bike" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/bike2.jpg" alt="Bike2" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/surf.jpg" alt="Surf" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />
          
          <img src="/kobe.jpg" alt="Kobe" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/ski2.jpg" alt="Ski2" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />

          <img src="/swim.jpg" alt="Swim" style={{
            width: '100%', borderRadius: '10px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            filter: 'brightness(1.2) contrast(1.05)',
            transition: 'transform 0.3s, filter 0.3s',
            objectFit: 'cover'
          }}
          onMouseEnter={(e)=>{e.target.style.transform='scale(1.05)'; e.target.style.filter='brightness(1.3) contrast(1.1)'}}
          onMouseLeave={(e)=>{e.target.style.transform='scale(1)'; e.target.style.filter='brightness(1.2) contrast(1.05)'}}
          />
          
        </div>
      </div>
    </div>
  );
};
