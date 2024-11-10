import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './HomePage/HomePage';
import { Login } from './Profile/Login';
import { Profile } from './Profile/Profile';
import { Friends } from './Profile/Friends';


/*
 * Este componente esta creado para manejar la navegacion entre componentes, por ejemplo Home -> Login, Home -> Profile, Home -> Crear Post, etc.
*/

export const App = () => {
    const handleLoginSuccess = () => {
      window.location.href = '/'; // Mandamos al home despues del Login
    };
  
    return (
      <Router>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
        </Routes>
      </Router>
    );
  };
  
  export default App;