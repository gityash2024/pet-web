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
                <StyledBadge>₹ {ad.price}</StyledBadge>
              </div>
              <ContactInfo>
                <FaMapMarkerAlt />
                <span>{ad.location}</span>
              </ContactInfo>
              <p>{ad.description}</p>
              
              {/* Pet Information Section */}
              <DetailSection>
                <h4><FaPaw className="me-2" />Pet Information</h4>
                
                <DetailItem>
                  <div className="label">Species/Breed:</div>
                  <div className="value">{ad.breed || 'Not specified'}</div>
                </DetailItem>
                
                <DetailItem>
                  <div className="label">Age:</div>
                  <div className="value">{ad.age ? `${ad.age} ${ad.ageUnit || 'weeks'}` : 'Not specified'}</div>
                </DetailItem>
                
                <DetailItem>
                  <div className="label">Sex:</div>
                  <div className="value">
                    {ad.gender ? 
                      ad.gender.charAt(0).toUpperCase() + ad.gender.slice(1) : 
                      'Not specified'}
                  </div>
                </DetailItem>
                
                <DetailItem>
                  <div className="label">Health Status:</div>
                  <div className="value">{ad.healthStatus || 'Not specified'}</div>
                </DetailItem>
                
                {/* Vaccination Details */}
                <DetailItem>
                  <div className="label">Vaccination:</div>
                  <div className="value">
                    <VaccinationBadge active={ad.vaccinationDetails?.firstVaccination}>
                      First vaccination
                    </VaccinationBadge>
                    <VaccinationBadge active={ad.vaccinationDetails?.deworming}>
                      Deworming
                    </VaccinationBadge>
                    <VaccinationBadge active={ad.vaccinationDetails?.boosters}>
                      Boosters
                    </VaccinationBadge>
                  </div>
                </DetailItem>
                
                {/* Vaccination Certificates */}
                {ad.vaccinationCertificates && ad.vaccinationCertificates.length > 0 && (
                  <DetailItem>
                    <div className="label">Vaccination Certificates:</div>
                    <div className="value">
                      {ad.vaccinationCertificates.map((cert, index) => (
                        <CertificateLink href={cert} target="_blank" key={index}>
                          Certificate {index + 1}
                        </CertificateLink>
                      ))}
                    </div>
                  </DetailItem>
                )}
                
                {/* Veterinary Health Certificate */}
                {ad.vetHealthCertificate && (
                  <DetailItem>
                    <div className="label">Veterinary Certificate:</div>
                    <div className="value">
                      <CertificateLink href={ad.vetHealthCertificate} target="_blank">
                        View Certificate
                      </CertificateLink>
                    </div>
                  </DetailItem>
                )}
                
                {/* Microchip ID */}
                {ad.microchipId && (
                  <DetailItem>
                    <div className="label">Microchip/Tag ID:</div>
                    <div className="value">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {ad.microchipId}
                        <IconButton
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(ad.microchipId);
                            toast.success('ID copied to clipboard');
                          }}
                          style={{ marginLeft: '8px', padding: '4px' }}
                        >
                          <Copy size={16} />
                        </IconButton>
                      </div>
                    </div>
                  </DetailItem>
                )}
              </DetailSection>
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
                  className="w-100 mt-3" 
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
                <h3>Interested?</h3>
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  handleStartConversation();
                }}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Your Name"
                      name="name"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Your Email"
                      name="email"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
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