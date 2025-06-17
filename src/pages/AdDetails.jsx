import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import { FaPaw, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaArrowLeft, FaComments } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { startConversation } from '../contexts/api';
import { Email, Person, Publish } from '@mui/icons-material';
import { Copy } from 'lucide-react';
import { IconButton } from '@mui/material';

const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
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
  background: linear-gradient(to bottom, var(--background-light), var(--background-highlight));
  color: var(--text-dark);
  min-height: 100vh;
  padding: 40px 0;
`;

const GlassmorphicCard = styled(motion.div)`
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-highlight) 100%);
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(192, 49, 21, 0.15);
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(251, 194, 31, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 40px 0 rgba(192, 49, 21, 0.25);
    transform: translateY(-5px);
  }
`;

const StyledBadge = styled(Badge)`
  font-size: 1rem;
  margin-right: 10px;
  background-color: var(--primary);
  padding: 8px 12px;
  border-radius: 8px;
`;

const PriceBadge = styled(Badge)`
  font-size: 1rem;
  margin-right: 10px;
  background-color: var(--secondary);
  color: var(--primary-dark);
  padding: 8px 12px;
  border-radius: 8px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: none;
  padding: 12px 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled(Button)`
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(192, 49, 21, 0.1);
    color: var(--primary-dark);
    transform: translateX(-5px);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background-color: rgba(251, 194, 31, 0.1);
  border-radius: 8px;
  
  svg {
    margin-right: 15px;
    color: var(--primary);
    font-size: 1.2rem;
  }
  
  span {
    color: var(--primary-dark);
    font-weight: 500;
  }
`;

const AdImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 3px solid var(--background-light);
`;

const AdTitle = styled.h1`
  color: var(--primary);
  margin-bottom: 15px;
  font-weight: 600;
`;

const AdDescription = styled.p`
  color: var(--text-dark);
  line-height: 1.8;
  font-size: 1.1rem;
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border-left: 3px solid var(--primary-light);
`;

const SectionTitle = styled.h3`
  color: var(--primary);
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 2px solid var(--secondary);
  padding-bottom: 10px;
`;

const StyledFormControl = styled(Form.Control)`
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 12px 15px;
  margin-bottom: 15px;
  
  &:focus {
    border-color: var(--primary-light);
    box-shadow: 0 0 0 0.2rem rgba(215, 118, 32, 0.25);
  }
`;

const DetailSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  
  h4 {
    color: #0a6638;
    margin-bottom: 15px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  .label {
    font-weight: bold;
    width: 150px;
    color: #666;
  }
  
  .value {
    flex: 1;
  }
`;

const VaccinationBadge = styled(Badge)`
  margin-right: 10px;
  background-color: ${props => props.active ? '#0a6638' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#666'};
  padding: 8px 12px;
`;

const CertificateLink = styled.a`
  color: #0a6638;
  text-decoration: underline;
  display: inline-block;
  margin-right: 10px;
  
  &:hover {
    color: #084a29;
  }
`;

const AdDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const ad = location.state?.advert;
  console.log(ad,'----------_____---____-Add details-____--____--____---___---____-')

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

  if (!ad) {
    navigate('/search');
    return null;
  }

  const formatDate = (dateString) => {  
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <StyledAdDetails>
      <Container>
        <BackButton onClick={() => navigate(-1)} className="mb-4">
          <FaArrowLeft className="me-2" /> Back
        </BackButton>
        <Row>
          <Col lg={8}>
            <GlassmorphicCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AdImage src={ad.images[0]} alt={ad.name} />
              <AdTitle>{ad.name}</AdTitle>
              <div className="mb-3">
                <StyledBadge>{ad.category}</StyledBadge>
                <PriceBadge>₹ {ad.price}</PriceBadge>
              </div>
              <ContactInfo>
                <FaMapMarkerAlt />
                <span>{ad.location}</span>
              </ContactInfo>
              <AdDescription>{ad.description}</AdDescription>
            </GlassmorphicCard>
          </Col>
          <Col lg={4}>
            <GlassmorphicCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SectionTitle>Contact Information</SectionTitle>
              <ContactInfo>
                <Person />
                <span>Owner Name: {ad.owner?.name}</span>
              </ContactInfo>
            
              <ContactInfo>
                <Publish />
                <span>Published At: {formatDate(ad?.updatedAt)} </span>
              </ContactInfo>
              <ContactInfo>
                <FaPaw />
                {ad?.category && <span>Category: {ad.category}</span>}
              </ContactInfo>
              <StyledButton 
                className="w-100 mt-4" 
                onClick={handleStartConversation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    Starting Conversation
                    <Spinner />
                  </>
                ) : (
                  <>
                    <FaComments className="me-2" /> Start Conversation
                  </>
                )}
              </StyledButton>
            </GlassmorphicCard>
            <GlassmorphicCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SectionTitle>Interested?</SectionTitle>
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleStartConversation();
              }}>
                <Form.Group className="mb-3">
                  <StyledFormControl
                    type="text"
                    placeholder="Your Name"
                    name="name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <StyledFormControl
                    type="email"
                    placeholder="Your Email"
                    name="email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <StyledFormControl
                    as="textarea"
                    rows={3}
                    placeholder="Your Message"
                    name="message"
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
  
export default AdDetails;