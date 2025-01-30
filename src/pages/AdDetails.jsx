import React from 'react';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import { FaPaw, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaArrowLeft, FaComments } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const StyledAdDetails = styled.div`
  background-color: #f8f9fa;
  color: #333;
  min-height: 100vh;
  padding: 20px 0;
`;

const GlassmorphicCard = styled(motion.div)`
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 30px;
  margin-bottom: 30px;
`;

const StyledBadge = styled(Badge)`
  font-size: 1rem;
  margin-right: 10px;
  background-color: #0a6638;
`;

const StyledButton = styled(Button)`
  background-color: #0a6638;
  border: none;
  &:hover {
    background-color: #084a29;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  svg {
    margin-right: 10px;
    color: #0a6638;
  }
`;

const AdImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 20px;
`;

const AdDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ad = location.state?.advert;

  if (!ad) {
    navigate('/search');
    return null;
  }

  const handleStartConversation = () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to start a conversation');
      return;
    }
    navigate('/messages');
  };

  return (
    <StyledAdDetails>
      <Container>
        <Button 
          variant="outline-primary" 
          onClick={() => navigate(-1)}
          className="mb-3"
        >
          <FaArrowLeft /> Back
        </Button>
        <Row>
          <Col lg={8}>
            <GlassmorphicCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AdImage src={ad.images[0]} alt={ad.name} />
              <h1>{ad.name}</h1>
              <div className="mb-3">
                <StyledBadge>{ad.category}</StyledBadge>
                <StyledBadge>₹{ad.price}</StyledBadge>
              </div>
              <ContactInfo>
                <FaMapMarkerAlt />
                <span>{ad.location}</span>
              </ContactInfo>
              <p>{ad.description}</p>
            </GlassmorphicCard>
          </Col>
          <Col lg={4}>
            <GlassmorphicCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>Contact Information</h3>
              <ContactInfo>
                <FaPaw />
                <span>Age: {ad.age} years</span>
              </ContactInfo>
              <ContactInfo>
                <FaPhone />
                <span>Breed: {ad.breed}</span>
              </ContactInfo>
              <StyledButton className="w-100 mt-3" onClick={handleStartConversation}>
                <FaComments className="me-2" /> Start Conversation
              </StyledButton>
            </GlassmorphicCard>
            <GlassmorphicCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3>Interested?</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Your Name" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="email" placeholder="Your Email" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control as="textarea" rows={3} placeholder="Your Message" />
                </Form.Group>
                <StyledButton type="submit" className="w-100">Send Message</StyledButton>
              </Form>
            </GlassmorphicCard>
          
          </Col>
        </Row>
      </Container>
    </StyledAdDetails>
  );
};

export default AdDetails;