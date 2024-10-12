import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { BsSun, BsMoon, BsList, BsPerson } from 'react-icons/bs';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const ProfileIcon = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  marginRight: 10px !important;
`;

const Header = ({ isDarkMode, toggleTheme, handleLoginModal, isLoggedIn, userProfilePic }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      handleLoginModal(true);
    }
  };

  return (
    <StyledNavbar
      bg={isDarkMode ? 'dark' : 'light'}
      variant={isDarkMode ? 'dark' : 'light'}
      expand="lg"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Pets4Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <BsList />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/search">Search</Nav.Link>
            <Nav.Link as={Link} to="/add-advert">Add Advert</Nav.Link>
            <Nav.Link as={Link} to="/messages">Messages</Nav.Link>
            <Nav.Link as={Link} to="/knowledge-hub">Knowledge Hub</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <ProfileIcon
              
                src={userProfilePic || 'https://via.placeholder.com/40'}
                alt="Profile"
                onClick={handleProfileClick}
              />
            ) : (
              <Nav.Link onClick={() => handleLoginModal(true)}>Login</Nav.Link>
            )}
            <Button
              variant={isDarkMode ? 'light' : 'dark'}
              onClick={toggleTheme}
              className="ms-2"
            >
              {isDarkMode ? <BsSun /> : <BsMoon />}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

Header.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  handleLoginModal: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  userProfilePic: PropTypes.string,
};

export default Header;