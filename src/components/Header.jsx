import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
import styled from 'styled-components';
import logoImage from '../../dog-icon.svg';
import { getAllCategories } from '../contexts/api';

const StyledNavbar = styled(Navbar)`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0.5rem 0;
  
  .navbar-brand {
    display: flex;
    align-items: center;
    img {
      height: 40px;
      margin-right: 10px;
    }
  }

  .nav-link {
    color: #333 !important;
    font-weight: 500;
    padding: 0.5rem 1rem;
    position: relative;
    
    &:hover {
      color: #0a6638 !important;
    }
    
    &.active {
      color: #0a6638 !important;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 2px;
        background-color: #0a6638;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .btn-new-advert {
    background-color: #0a6638;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-weight: 500;
    &:hover {
      background-color: #085530;
    }
  }
  
  .profile-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  @media (max-width: 991px) {
    .navbar-collapse {
      background-color: #fff;
      padding: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  }
  
  @media (max-width: 768px) {
    .btn-new-advert, .profile-section > img, .profile-section > button {
      display: none; /* Hide these elements on mobile as they'll be in bottom nav */
    }
    
    .navbar-toggler {
      display: none; /* Hide hamburger menu on mobile */
    }
    
    .navbar-collapse {
      display: none !important; /* Force hide the collapsible menu on mobile */
    }
  }
`;

const AnimalCategories = styled.div`
  display: flex;
  justify-content: ${props => props.itemCount <= 6 ? 'center' : 'flex-start'};
  gap: 2rem;
  padding: 1rem 2rem;
  background-color: #fffacc;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #333;
    flex: 0 0 auto;
    min-width: 80px;
    
    svg {
      width: 24px;
      height: 24px;
      margin-bottom: 0.5rem;
      color: #0a6638;
    }
    
    &:hover {
      color: #0a6638;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    justify-content: ${props => props.itemCount <= 4 ? 'center' : 'flex-start'};
    display: none; /* Hide categories on mobile */
  }
`;

const LoginButton = styled(Button)`
  background-color: transparent;
  border: 2px solid #0a6638;
  color: #ffffff;
  &:hover {
    background-color: #0a6638;
    color: #fff;
  }
`;

const Header = ({ handleLoginModal, isLoggedIn, userProfilePic }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
      setExpanded(false);
    } else {
      handleLoginModal(true);
      setExpanded(false);
    }
  };

  const handleNewAdvert = () => {
    if (isLoggedIn) {
      navigate('/add-advert');
      setExpanded(false);
    } else {
      handleLoginModal(true);
      setExpanded(false);
    }
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  const icons = [
    'M12 2c3.31 0 6 2 6 5 0 .24-.04.47-.09.7L19 9h1c1.1 0 2 .9 2 2v2c0 .55-.22 1.05-.59 1.41L19 16v7h-2v-4l-2-2h-2l-2 2v4H9v-7l-2.41-2.41C6.22 13.05 6 12.55 6 12v-2c0-1.1.9-2 2-2h1l1.09-1.3c-.05-.23-.09-.46-.09-.7 0-3 2.69-5 6-5z',
    'M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z',
    'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z',
    'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z',
    'M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'
  ];

  const getRandomIcon = () => icons[Math.floor(Math.random() * icons.length)];

  const categoryLinks = categories.map(category => ({
    name: category.name,
    path: `/search?category=${category.name.toLowerCase()}`,
    icon: getRandomIcon()
  }));

  return (
    <>
      <StyledNavbar expand="lg" fixed="top" expanded={expanded}>
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
            <img src={logoImage} alt="Pets4Home" />
            Pets4Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)}>
            <BsList />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link" onClick={handleNavClick}>Home</NavLink>
              <NavLink to="/search" className="nav-link" onClick={handleNavClick}>Search</NavLink>
              {/* <NavLink to="/messages" className="nav-link" onClick={handleNavClick}>Messages</NavLink> */}
              <NavLink to="/knowledge-hub" className="nav-link" onClick={handleNavClick}>Knowledge Hub</NavLink>
            </Nav>
            <div className="profile-section">
              <Button 
                className="btn-new-advert"
                onClick={handleNewAdvert}
              >
                + New Advert
              </Button>
              {isLoggedIn ? (
                <img
                  src={userProfilePic || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                  onClick={handleProfileClick}
                />
              ) : (
                <LoginButton onClick={() => {
                  handleLoginModal(true);
                  setExpanded(false);
                }}>
                  Login / Sign Up
                </LoginButton>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>
      <div style={{ marginTop: '76px' }}>
        {!loading && categories.length > 0 && (
        <AnimalCategories itemCount={categoryLinks.length}>
        {categoryLinks.map((category, index) => (
          <Link 
            key={index} 
            to={category.path} 
            className="category-item" 
            onClick={handleNavClick}
          >
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d={category.icon} />
            </svg>
            {category.name}
          </Link>
        ))}
      </AnimalCategories>
        )}
      </div>
    </>
  );
};

export default Header;