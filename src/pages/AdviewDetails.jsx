import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import { FaPaw, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaArrowLeft, FaComments } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { startConversation } from '../contexts/api';

const Spinner = styled.div`
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #ffffff;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

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

const AdviewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ad = location.state?.advert;

  console.log(ad,'----------_____---____--Add view details____--____--____---___---____-')
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'profile',
    interest: 'Pet Interest',
    source: 'Ad Details Page',
    requirements: ''
  });

  const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxYwYTOvqp9WBKswFDsHPK6FrL-oDojacB9A3TUjPdepFOoQarTpxhuKSDLQ_XonLk/exec';

  if (!ad) {
    navigate('/search');
    return null;
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      requirements: `Interest in: ${ad.name} (${ad.category})`
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      toast.success('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: '',
        type: 'profile',
        interest: 'Pet Interest',
        source: 'Ad Details Page',
        requirements: ''
      });
      handleStartConversation();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConversation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to start a conversation');
      return;
    }

    try {
      setIsLoading(true);
      const response = await startConversation(ad._id);
      
      if (response.data && (response.data.status === 200 || response.data.status === 201)) {
        navigate('/messages', { 
          state: { 
            conversationId: response.data.conversationId
          } 
        });
        toast.success('Conversation started successfully');
      } else {
        toast.error('Failed to start conversation');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledAdDetails>
      <Container>
        <Button variant="outline-primary" onClick={() => navigate(-1)} className="mb-3">
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
                <FaHeart />
                <span>Age: {ad.age} years</span>
              </ContactInfo>
              <ContactInfo>
                <FaPaw />
                <span>Breed: {ad.breed}</span>
              </ContactInfo>
            </GlassmorphicCard>
            <GlassmorphicCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3>Interested?</h3>
              <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Your Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control 
                    type="email" 
                    placeholder="Your Email" 
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Your Message" 
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <StyledButton 
                  type="submit" 
                  className="w-100 d-flex align-items-center justify-content-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      Sending
                      <Spinner />
                    </>
                  ) : (
                    'Send Message'
                  )}
                </StyledButton>
              </Form>
            </GlassmorphicCard>
          </Col>
        </Row>
      </Container>
    </StyledAdDetails>
  );
};

export default AdviewDetails;