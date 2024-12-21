import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './HomePage/HomePage';
import { Login } from './Profile/Login';
import { Profile } from './Profile/Profile';
import { Friends } from './Profile/Friends';
import { EditProfile } from './Profile/EditProfile';
import { Settings } from './Profile/Settings';
import { ResetPassword } from './Profile/ResetPassword';
import { AdminDashboard } from './Admin/AdminDashboard';
import { AdministradorPostReview } from './Admin/AdministradorPostReview';
import { Search } from './HomePage/Search';
import { NotificationsProvider } from './Notificaciones/NotificationsProvider';

/*
 * Este componente esta creado para manejar la navegacion entre componentes, por ejemplo Home -> Login, Home -> Profile, Home -> Crear Post, etc.
*/

export const App = () => {
    const handleLoginSuccess = () => {
      window.location.href = '/'; // Mandamos al home despues del Login
    };
  
    return (
      <NotificationsProvider>
        <Router>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/logout" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Search" element={<Search />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
            <Route path="/admin/review/:postId" element={<AdministradorPostReview />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Routes>
        </Router>
      </NotificationsProvider>
    );
  };
  
  export default App;