import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaHeart, FaSearch, FaPlus, FaUser } from 'react-icons/fa';

const BottomNavContainer = styled.div`
  display: none; /* Hidden by default */
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  @media (max-width: 768px) {
    display: flex; /* Only show on mobile */
  }
`;

const NavItems = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 100%;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.isActive ? '#ffcc00' : '#777'};
  text-decoration: none;
  height: 100%;
  flex: 1;
  position: relative;
  font-weight: ${props => props.isActive ? '600' : '400'};
  transition: all 0.2s ease;
  
  &:hover {
    color: #ffcc00;
  }

  svg {
    font-size: 22px;
    margin-bottom: 4px;
    transition: transform 0.2s ease;
    transform: ${props => props.isActive ? 'scale(1.2)' : 'scale(1)'};
  }
  
  span {
    font-size: 11px;
    letter-spacing: 0.5px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.isActive ? '40%' : '0'};
    height: 3px;
    background-color: #ffcc00;
    border-radius: 2px 2px 0 0;
    transition: width 0.2s ease;
  }
`;

const BottomNav = ({ isLoggedIn, handleLoginModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavClick = (path, requiresAuth) => (e) => {
    if (requiresAuth && !isLoggedIn) {
      e.preventDefault();
      handleLoginModal(true);
      return false;
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <BottomNavContainer>
      <NavItems>
        <NavItem 
          to={isLoggedIn ? "/messages" : "#"}
          onClick={handleNavClick('/messages', true)}
          isActive={isActive('/messages')}
        >
          <FaEnvelope />
          <span>MESSAGES</span>
        </NavItem>
        
        <NavItem 
          to={isLoggedIn ? "/saved" : "#"}
          onClick={handleNavClick('/saved', true)}
          isActive={isActive('/saved')}
        >
          <FaHeart />
          <span>SAVED</span>
        </NavItem>
        
        <NavItem 
          to="/search"
          isActive={isActive('/search')}
        >
          <FaSearch />
          <span>SEARCH</span>
        </NavItem>
        
        <NavItem 
          to={isLoggedIn ? "/add-advert" : "#"}
          onClick={handleNavClick('/add-advert', true)}
          isActive={isActive('/add-advert')}
        >
          <FaPlus />
          <span>ADVERT</span>
        </NavItem>
        
        <NavItem 
          to={isLoggedIn ? "/profile" : "#"}
          onClick={handleNavClick('/profile', true)}
          isActive={isActive('/profile')}
        >
          <FaUser />
          <span>PROFILE</span>
        </NavItem>
      </NavItems>
    </BottomNavContainer>
  );
};

export default BottomNav; 