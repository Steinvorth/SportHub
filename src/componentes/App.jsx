import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './HomePage/HomePage';
import { Login } from './Profile/Login';

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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </Router>
    );
  };
  
  export default App;