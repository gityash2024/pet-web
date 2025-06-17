import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaInstagram, FaTwitter, FaGoogle, FaApple } from 'react-icons/fa';

const StyledFooter = styled.footer`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  padding: 3rem 0 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--secondary) 0%, var(--secondary-light) 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(251, 194, 31, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const FooterSection = styled.div`
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  h5 {
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--secondary);
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 40px;
      height: 2px;
      background: var(--secondary-light);
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateX(5px);
    }
  }
  
  a {
    color: #fff;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--secondary);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  a {
    color: #fff;
    font-size: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--primary);
      background: var(--secondary);
      transform: translateY(-3px);
    }
  }
`;

const AppButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--secondary);
      color: var(--primary);
      transform: translateY(-3px);
    }
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const BottomBar = styled.div`
  background: linear-gradient(135deg, var(--primary-dark) 0%, rgba(136, 28, 4, 0.9) 100%);
  padding: 1rem 0;
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
  
  p {
    margin: 0;
  }
  
  a {
    color: var(--secondary-light);
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--secondary);
      text-decoration: underline;
    }
  }
`;

const AppDownloadSection = styled(FooterSection)`
  @media (max-width: 768px) {
    display: none; /* Hide the app download section on mobile */
  }
`;

const Footer = ({ isDarkMode }) => {
  return (
    <StyledFooter>
      <Container>
        <Row>
          <Col md={3}>
            <FooterSection>
              <h5>PETXMAFIA</h5>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                {/* <li><Link to="/press">Press</Link></li>
                <li><Link to="/careers">Careers</Link></li> */}
              </ul>
              <SocialLinks>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              </SocialLinks>
            </FooterSection>
          </Col>
          <Col md={3}>
            <FooterSection>
              <h5>Dogs and Puppies For Sale</h5>
              <ul>
                <li><Link to="/search?breed=labrador">Labrador Retriever</Link></li>
                <li><Link to="/search?breed=germanshepherd">German Shepherd</Link></li>
                <li><Link to="/search?breed=frenchbulldog">French Bulldog</Link></li>
                <li><Link to="/search?breed=goldenretriever">Golden Retriever</Link></li>
              </ul>
            </FooterSection>
          </Col>
          <Col md={3}>
            <FooterSection>
              <h5>Cats and Kittens For Sale</h5>
              <ul>
                <li><Link to="/search?breed=persian">Persian</Link></li>
                <li><Link to="/search?breed=siamese">Siamese</Link></li>
                <li><Link to="/search?breed=mainecoon">Maine Coon</Link></li>
                <li><Link to="/search?breed=bengal">Bengal</Link></li>
              </ul>
            </FooterSection>
          </Col>
          <Col md={3}>
            <AppDownloadSection>
              <h5>Download Our App</h5>
              <p>Get the best pet shopping experience on our mobile app</p>
              <AppButtons>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                  <FaGoogle /> Google Play
                </a>
                <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer">
                  <FaApple /> App Store
                </a>
              </AppButtons>
            </AppDownloadSection>
          </Col>
        </Row>
      </Container>
      <BottomBar>
        <Container>
          <Row>
            <Col>
              <p>
                © {new Date().getFullYear()} PETXMAFIA. All rights reserved |{' '}
                <Link to="/privacy-policy">Privacy Policy</Link> |{' '}
                <Link to="/terms">Terms of Use</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </BottomBar>
    </StyledFooter>
  );
};

export default Footer;