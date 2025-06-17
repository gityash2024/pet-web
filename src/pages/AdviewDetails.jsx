import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import { FaPaw, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaArrowLeft, FaUser } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { startConversation } from '../contexts/api';
import axios from 'axios';

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  flex-direction: column;

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #0a6638;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
`;

const AdviewDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormLoading, setIsFormLoading] = useState(false);
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

  // Fetch advert data on component mount
  useEffect(() => {
    const fetchAdvertData = async () => {
      try {
        setLoading(true);
        let advertId = id;
        
        // Extract ID from URL if id param not available
        if (!advertId) {
          advertId = window.location.pathname.split('/').pop();
        }
        
        if (!advertId) {
          setError('Advertisement ID not found');
          navigate('/search');
          return;
        }
        
        console.log('Fetching advert with ID:', advertId);
        const response = await axios.get(`https://petsforhome-backend.onrender.com/api/pets/${advertId}`);
        
        if (response.data && response.data.status === 200) {
          console.log('Fetched advert data:', response.data.pet);
          setAd(response.data.pet);
          
          // Update form requirements
          setFormData(prev => ({
            ...prev,
            requirements: `Interest in: ${response.data.pet.name} (${response.data.pet.category})`
          }));
        } else {
          setError('Failed to load advertisement details');
          toast.error('Failed to load advertisement details');
        }
      } catch (error) {
        console.error('Error fetching advert:', error);
        setError('Failed to load advertisement details');
        toast.error('Failed to load advertisement details');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertData();
  }, [id, navigate]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsFormLoading(true);

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
        requirements: ad ? `Interest in: ${ad.name} (${ad.category})` : ''
      });
      handleStartConversation();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleStartConversation = async () => {
    if (!ad) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to start a conversation');
      return;
    }

    try {
      setIsFormLoading(true);
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
      setIsFormLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="spinner"></div>
        <p>Loading advertisement details...</p>
      </LoadingContainer>
    );
  }

  if (error || !ad) {
    return (
      <Container className="py-5 text-center">
        <h3>Oops! {error || 'Advertisement not found'}</h3>
        <Button variant="primary" onClick={() => navigate('/search')} className="mt-3">
          Browse Pets
        </Button>
      </Container>
    );
  }

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
                <PriceBadge>₹{ad.price}</PriceBadge>
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
                <FaHeart />
                <span>Age: {ad.age ? `${ad.age} ${ad.ageUnit || 'weeks'}` : 'Not specified'}</span>
              </ContactInfo>
              <ContactInfo>
                <FaPaw />
                <span>Breed: {ad.breed || 'Not specified'}</span>
              </ContactInfo>
              {ad.owner && (
                <>
                  <ContactInfo>
                    <FaUser />
                    <span>Owner: {ad.owner.name || 'Not specified'}</span>
                  </ContactInfo>
                  {ad.owner.phone && (
                    <ContactInfo>
                      <FaPhone />
                      <span>Phone: {ad.owner.phone}</span>
                    </ContactInfo>
                  )}
                  {ad.owner.email && (
                    <ContactInfo>
                      <FaEnvelope />
                      <span>Email: {ad.owner.email}</span>
                    </ContactInfo>
                  )}
                </>
              )}
            </GlassmorphicCard>
            <GlassmorphicCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SectionTitle>Interested?</SectionTitle>
              <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3">
                  <StyledFormControl 
                    type="text" 
                    placeholder="Your Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <StyledFormControl 
                    type="email" 
                    placeholder="Your Email" 
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <StyledFormControl 
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
                  disabled={isFormLoading}
                >
                  {isFormLoading ? (
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