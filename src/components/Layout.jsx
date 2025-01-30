import Header from './Header';
import Footer from './Footer';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useScrollTop } from '../hooks/useScrollTop';

import profileImage from '../assets/profile.png';
const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.isDarkMode ? '#333' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 100%;
`;

const Layout = ({ children, isDarkMode, toggleTheme,handleLoginModal }) => {
  useScrollTop();
  return (
    <LayoutWrapper isDarkMode={isDarkMode}>
<Header 
  isDarkMode={isDarkMode} 
  toggleTheme={toggleTheme} 
  handleLoginModal={handleLoginModal}
  isLoggedIn={localStorage.getItem('token')} 
  userProfilePic={profileImage} 
/>      <MainContent>
        {children}
      </MainContent>
      <Footer isDarkMode={isDarkMode} />
    </LayoutWrapper>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Layout;