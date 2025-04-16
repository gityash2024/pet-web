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
        const response = await axios.get(`http://localhost:5000/api/pets/${advertId}`);
        
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
              {ad.images && ad.images.length > 0 ? (
                <AdImage src={ad.images[0]} alt={ad.name} />
              ) : (
                <div style={{ height: '400px', background: '#f0f0f0', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <p>No image available</p>
                </div>
              )}
              <h1>{ad.name}</h1>
              <div className="mb-3">
                <StyledBadge>{ad.category}</StyledBadge>
                <StyledBadge>₹{ad.price}</StyledBadge>
                {ad.gender && <StyledBadge>{ad.gender}</StyledBadge>}
              </div>
              <ContactInfo>
                <FaMapMarkerAlt />
                <span>{ad.location}</span>
              </ContactInfo>
              <p>{ad.description}</p>
              
              {/* Pet Information Section */}
              <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <h4 style={{ color: '#0a6638', marginBottom: '15px' }}>
                  <FaPaw style={{ marginRight: '10px' }} />
                  Pet Information
                </h4>
                
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', width: '150px', color: '#666' }}>Species/Breed:</div>
                  <div>{ad.breed || 'Not specified'}</div>
                </div>
                
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', width: '150px', color: '#666' }}>Age:</div>
                  <div>{ad.age ? `${ad.age} ${ad.ageUnit || 'weeks'}` : 'Not specified'}</div>
                </div>
                
                {ad.gender && (
                  <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', width: '150px', color: '#666' }}>Sex:</div>
                    <div>
                      {ad.gender.charAt(0).toUpperCase() + ad.gender.slice(1)}
                    </div>
                  </div>
                )}
                
                {ad.healthStatus && (
                  <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', width: '150px', color: '#666' }}>Health Status:</div>
                    <div>{ad.healthStatus}</div>
                  </div>
                )}
                
                {/* Vaccination Details */}
                {ad.vaccinationDetails && (
                  <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', width: '150px', color: '#666' }}>Vaccination:</div>
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <span 
                          style={{ 
                            padding: '8px 12px', 
                            borderRadius: '5px', 
                            backgroundColor: ad.vaccinationDetails.firstVaccination ? '#0a6638' : '#e0e0e0',
                            color: ad.vaccinationDetails.firstVaccination ? 'white' : '#666'
                          }}
                        >
                          First vaccination
                        </span>
                        <span 
                          style={{ 
                            padding: '8px 12px', 
                            borderRadius: '5px', 
                            backgroundColor: ad.vaccinationDetails.deworming ? '#0a6638' : '#e0e0e0',
                            color: ad.vaccinationDetails.deworming ? 'white' : '#666'
                          }}
                        >
                          Deworming
                        </span>
                        <span 
                          style={{ 
                            padding: '8px 12px', 
                            borderRadius: '5px', 
                            backgroundColor: ad.vaccinationDetails.boosters ? '#0a6638' : '#e0e0e0',
                            color: ad.vaccinationDetails.boosters ? 'white' : '#666'
                          }}
                        >
                          Boosters
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Vaccination Certificates */}
                {ad.vaccinationCertificates && ad.vaccinationCertificates.length > 0 && (
                  <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', width: '150px', color: '#666' }}>Certificates:</div>
                    <div>
                      {ad.vaccinationCertificates.map((cert, index) => (
                        <a 
                          key={index}
                          href={cert} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#0a6638', 
                            textDecoration: 'underline', 
                            display: 'inline-block',
                            marginRight: '10px' 
                          }}
                        >
                          Certificate {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Veterinary Health Certificate */}
                {ad.vetHealthCertificate && (
                  <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', width: '150px', color: '#666' }}>Vet Certificate:</div>
                    <div>
                      <a 
                        href={ad.vetHealthCertificate} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#0a6638', 
                          textDecoration: 'underline'
                        }}
                      >
                        View Certificate
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Microchip ID */}
                {ad.microchipId && (
                  <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', width: '150px', color: '#666' }}>Microchip/Tag ID:</div>
                    <div>{ad.microchipId}</div>
                  </div>
                )}
              </div>
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