import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`py-3 footer ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Container fluid>
        <Row>
          <Col md={4}>
            <h5>Pets4Home</h5>
            <p>Your friendly marketplace for pets and pet accessories.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className={isDarkMode ? 'text-light' : 'text-dark'}>Home</a></li>
              <li><a href="/search" className={isDarkMode ? 'text-light' : 'text-dark'}>Search</a></li>
              <li><a href="/add-advert" className={isDarkMode ? 'text-light' : 'text-dark'}>Add Advert</a></li>
              <li><a href="/knowledge-hub" className={isDarkMode ? 'text-light' : 'text-dark'}>Knowledge Hub</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>Email: info@pets4home.com</p>
            <p>Phone: (123) 456-7890</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p>&copy; 2023 Pets4Home. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

export default Footer;