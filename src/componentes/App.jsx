import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './HomePage/HomePage';
import { Login } from './Profile/Login';
import { Profile } from './Profile/Profile';
import { Friends } from './Profile/Friends';
import { ManagePost } from './PostCreation/ManagePost';
import { EditProfile } from './Profile/EditProfile';
import { Settings } from './Profile/Settings';
import { AdminDashboard } from './Admin/AdminDashboard';
import { AdministradorPostReview } from './Admin/AdministradorPostReview';



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
          <Route path="/post" element={<ManagePost />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/review/:postId" element={<AdministradorPostReview />} />
        </Routes>
      </Router>
    );
  };
  
  export default App;