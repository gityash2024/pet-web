import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'react-bootstrap';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import AdviewDetails from './pages/AdviewDetails';
import AdDetails from './pages/AdDetails';
import AddAdvert from './pages/AddAdvert';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import KnowledgeHub from './pages/KnowledgeHub';
import KnowledgeDetails from './pages/KnowledgeHubDetails';
import { AuthProvider } from './contexts/AuthContext';
import SavedItemsProvider from './contexts/SavedItemsContext';
import LoginModal from './components/LoginModal';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './style.css';
import ToastContainer from './components/Toast/ToastContainer';
import NotFound from './components/NotFound';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import ScrollToTopButton from './components/ScrollToTopButton'; // The button component

function AppRoutes() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
    window.location.reload();
  };

  const [showLogin, setShowLogin] = useState(false);

  const handleLoginModal = (status) => {
    setShowLogin(status);
  };

  return (
    <>
      <Layout handleLoginModal={handleLoginModal}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ad/:id" element={<AdDetails />} />
          <Route path="/ad/viewDetails/:id" element={<AdviewDetails />} />
          <Route path="/add-advert" element={<AddAdvert />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/knowledge-hub" element={<KnowledgeHub />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/knowledge-hub-details/:id" element={<KnowledgeDetails />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Layout>
      <ScrollToTopButton /> 
      <LoginModal 
        show={showLogin} 
        handleClose={() => handleLoginModal(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="426866646203-359sdhcmpq08648kfvfravrf9g7spar8.apps.googleusercontent.com">
      <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"
      >
        <div className="app">
          <AuthProvider>
            <SavedItemsProvider>
              <Router>
                <AppRoutes />
              </Router>
            </SavedItemsProvider>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;