import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaInstagram, FaTwitter, FaGoogle, FaApple } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: ${props => props.isDarkMode ? '#222' : '#0a6638'};
  color: #fff;
  padding: 2rem 0 0;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    padding-bottom: 0; /* Remove padding to ensure footer touches bottom nav */
    margin-bottom: 0; /* Remove margin to ensure footer touches bottom nav */
  }
`;

const FooterSection = styled.div`
  margin-bottom: 2rem;
  h5 {
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 0.75rem;
  }
  a {
    color: #fff;
    text-decoration: none;
    &:hover {
      color: #fffacc;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  a {
    color: #fff;
    font-size: 1.5rem;
    &:hover {
      color: #fffacc;
    }
  }
`;

const AppButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  img {
    height: 40px;
  }
`;

const BottomBar = styled.div`
  background-color: #085530;
  padding: 1rem 0;
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  p {
    margin: 0;
  }
`;

const AppDownloadSection = styled(FooterSection)`
  @media (max-width: 768px) {
    display: none; /* Hide the app download section on mobile */
  }
`;

const Footer = ({ isDarkMode }) => {
  return (
    <FooterContainer isDarkMode={isDarkMode}>
      <Container>
        <Row>
          <Col md={3}>
            <FooterSection>
              <h5>Pets4Home</h5>
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
                © {new Date().getFullYear()} Pets4Home. All rights reserved |{' '}
                <Link to="/privacy-policy">Privacy Policy</Link> |{' '}
                <Link to="/terms">Terms of Use</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;