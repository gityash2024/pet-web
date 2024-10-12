import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'react-bootstrap';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import AdDetails from './pages/AdDetails';
import AddAdvert from './pages/AddAdvert';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import KnowledgeHub from './pages/KnowledgeHub';
import KnowledgeDetails from './pages/KnowledgeHubDetails';
import { AuthProvider } from './contexts/AuthContext';
import LoginModal from './components/LoginModal';
import { GoogleOAuthProvider } from '@react-oauth/google';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ToastContainer from './components/Toast/ToastContainer';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLoginModal = (status) => {
    setShowLogin(status);
  };

  return (
    <GoogleOAuthProvider clientId="426866646203-359sdhcmpq08648kfvfravrf9g7spar8.apps.googleusercontent.com">

    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
      minBreakpoint="xxs"
    >
      <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <AuthProvider>
          <Router>
            <AppContent
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              showLogin={showLogin}
              handleLoginModal={handleLoginModal}
            />
          </Router>
        </AuthProvider>
      </div>
    </ThemeProvider>

    </GoogleOAuthProvider>
  );
}

function AppContent({ isDarkMode, toggleTheme, showLogin, handleLoginModal }) {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme} handleLoginModal={handleLoginModal}>
        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/search" element={<Search isDarkMode={isDarkMode}/>} />
          <Route path="/ad/:id" element={<AdDetails isDarkMode={isDarkMode}/>} />
          <Route path="/add-advert" element={<AddAdvert isDarkMode={isDarkMode}/>} />
          <Route path="/messages" element={<Messages isDarkMode={isDarkMode}/>} />
          <Route path="/profile" element={<Profile isDarkMode={isDarkMode}/>} />
          <Route path="/knowledge-hub" element={<KnowledgeHub isDarkMode={isDarkMode}/>} />
          <Route path="/knowledge-hub-details/:id" element={<KnowledgeDetails isDarkMode={isDarkMode}/>} />
        </Routes>
      </Layout>
      <LoginModal 
        show={showLogin} 
        handleClose={() => handleLoginModal(false)} 
        isDarkMode={isDarkMode}
        onLoginSuccess={handleLoginSuccess}
      />
        <ToastContainer />
    </>
  );
}

export default App;