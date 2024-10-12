import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Form, Alert, Spinner, Toast } from 'react-bootstrap';
import { FaPaw, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaArrowLeft, FaComments, FaExclamationCircle } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams, useNavigate } from 'react-router-dom';
import { getAdvertById, startConversation } from '../contexts/api';
import { toast } from 'react-toastify';

const StyledAdDetails = styled.div`
  background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  min-height: 100vh;
  padding: 80px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://example.com/pet-background.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: -1;
  }
`;

const GlassmorphicCard = styled(motion.div)`
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 30px;
  margin-bottom: 30px;
`;

const StyledBadge = styled(Badge)`
  font-size: 1rem;
  margin-right: 10px;
  background-color: ${props => props.isDarkMode ? '#4CAF50' : '#28a745'};
`;

const StyledButton = styled(Button)`
  background-color: #4CAF50;
  border: none;
  &:hover {
    background-color: #45a049;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  svg {
    margin-right: 10px;
    color: #4CAF50;
  }
`;

const ImageSlider = styled(Slider)`
  .slick-slide img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 15px;
  }
`;

const BackButton = styled(Button)`
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 1000;
`;

const NoAdvertFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
`;

const BigIcon = styled(FaExclamationCircle)`
  font-size: 5rem;
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  margin-bottom: 1rem;
`;
const AdImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 20px;
`;


const AdDetails = ({ isDarkMode }) => {
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAdDetails();
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            setLoading(true);
            const response = await getAdvertById(id);
            setAd(response.data.advert);
            setLoading(false);
        } catch (err) {
            setError('Failed to load advert details. Please try again.');
            setLoading(false);
        }
    };

    const handleStartConversation = async () => {
        try {
            const response = await startConversation(id);
            if (response.data.status === 200 || response.data.status === 201) {
                navigate('/messages', { state: { conversationId: response.data.conversationId } });
            } else {
                toast.error('Failed to start conversation. Please try again.');
            }
        } catch (err) {
            console.error('Error starting conversation:', err);
            toast.error('Failed to start conversation. Please try again.');
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!ad) {
        return (
            <StyledAdDetails isDarkMode={isDarkMode}>
                <Container>
                    <NoAdvertFound>
                        <BigIcon isDarkMode={isDarkMode} />
                        <h2>No Advertisement Found</h2>
                        <p>The advert you're looking for doesn't exist or has been removed.</p>
                        <Button variant="primary" onClick={() => navigate('/adverts')}>
                            Back to Advertisements
                        </Button>
                    </NoAdvertFound>
                </Container>
            </StyledAdDetails>
        );
    }

    return (
        <StyledAdDetails isDarkMode={isDarkMode}>
            <Container>
                <BackButton variant="outline-primary" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </BackButton>
                <Row>
                    <Col lg={8}>
                        <GlassmorphicCard 
                            isDarkMode={isDarkMode}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AdImage src={ad.image} alt={ad.title} />
                            <h1>{ad.title}</h1>
                            <div className="mb-3">
                                <StyledBadge isDarkMode={isDarkMode}>{ad.category}</StyledBadge>
                                <StyledBadge isDarkMode={isDarkMode}>${ad.price}</StyledBadge>
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
                            isDarkMode={isDarkMode}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3>Contact Information</h3>
                            <ContactInfo>
                                <FaPaw />
                                <span>Owner: {ad.owner?.name || 'Not available'}</span>
                            </ContactInfo>
                            <ContactInfo>
                                <FaPhone />
                                <span>Phone: {ad.owner?.phone || 'Not available'}</span>
                            </ContactInfo>
                            <ContactInfo>
                                <FaEnvelope />
                                <span>Email: {ad.owner?.email || 'Not available'}</span>
                            </ContactInfo>
                            <StyledButton className="w-100 mt-3" onClick={handleStartConversation}>
                                <FaComments className="me-2" /> Start Conversation
                            </StyledButton>
                        </GlassmorphicCard>
                        <GlassmorphicCard 
                            isDarkMode={isDarkMode}
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
                        <GlassmorphicCard 
                            isDarkMode={isDarkMode}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <StyledButton className="w-100">
                                <FaHeart className="me-2" /> Save to Favorites
                            </StyledButton>
                        </GlassmorphicCard>
                    </Col>
                </Row>
            </Container>
        </StyledAdDetails>
    );
};

AdDetails.propTypes = {
    isDarkMode: PropTypes.bool.isRequired
};

export default AdDetails;