import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav/BottomNav';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useScrollTop } from '../hooks/useScrollTop';

import profileImage from '../assets/profile.png';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f8f8 0%, var(--background-highlight) 100%);
  color: var(--text-dark);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(251, 194, 31, 0.15) 0%, transparent 70%),
                radial-gradient(circle at bottom left, rgba(192, 49, 21, 0.08) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 100%;
  position: relative;
  z-index: 1;
  padding-bottom: 2rem;
`;

const Layout = ({ children, isDarkMode, toggleTheme, handleLoginModal }) => {
  useScrollTop();
  const isLoggedIn = localStorage.getItem('token');
  
  return (
    <LayoutWrapper isDarkMode={isDarkMode}>
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        handleLoginModal={handleLoginModal}
        isLoggedIn={localStorage.getItem('token')} 
        userProfilePic={profileImage} 
      />
      <MainContent>
        {children}
      </MainContent>
      <Footer isDarkMode={isDarkMode} />
      <BottomNav 
        isLoggedIn={isLoggedIn}
        handleLoginModal={handleLoginModal}
      />
    </LayoutWrapper>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  isDarkMode: PropTypes.bool,
  toggleTheme: PropTypes.func,
  handleLoginModal: PropTypes.func
};

Layout.defaultProps = {
  isDarkMode: false,
  toggleTheme: () => {},
  handleLoginModal: () => {}
};

export default Layout;