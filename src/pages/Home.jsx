import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import { FaPaw, FaSearch, FaPlus, FaComments, FaBookOpen } from 'react-icons/fa';
import styled, { css } from 'styled-components';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from 'prop-types';
import { getAllPets, getAllArticles, getAllAccessories,getAllAdverts } from '../contexts/api';
import { toast } from 'react-toastify';

const StyledHome = styled.div`
  ${({ isDarkMode }) => isDarkMode && css`
    background-color: #1a1a1a;
    color: #fff;
  `}
`;

const Section = styled.section`
  padding: 80px 0;
`;

const HeroSection = styled(Section)`
  background-color: ${props => props.isDarkMode ? '#222' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  padding-top: 120px;
  padding-bottom: 120px;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
`;

const HeroImage = styled.div`
  position: absolute;
  right: -10%;
  top: 50%;
  transform: translateY(-50%);
  width: 60%;
  height: 120%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 50% 0 0 50%;
  opacity: 0.7;
`;

const GlassmorphicCard = styled(motion.div)`
  padding: 30px;
  border-radius: 15px;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  cursor: pointer;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: #4CAF50;
  margin-bottom: 1rem;
`;

const StatsSection = styled(Section)`
  background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#f1f3f5'};
`;

const StatCard = styled(GlassmorphicCard)`
  text-align: center;
`;

const StatIcon = styled(FaPaw)`
  font-size: 2.5rem;
  color: #4CAF50;
  margin-bottom: 1rem;
`;

const StatValue = styled.h3`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0;
`;

const StatLabel = styled.p`
  font-size: 1.1rem;
  color: ${props => props.isDarkMode ? '#ccc' : '#6c757d'};
`;

const CTASection = styled(Section)`
  background-color: #4CAF50;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23388E3C" fill-opacity="1" d="M0,224L60,229.3C120,235,240,245,360,240C480,235,600,213,720,213.3C840,213,960,235,1080,229.3C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>');
    background-size: cover;
    background-repeat: no-repeat;
  }
`;
const GrassBlade = styled.div`
  position: absolute;
  bottom: 0;
  width: 40px;
  height: 100px;
  background-color: #388E3C;
  border-radius: 0 100% 0 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 30px;
    height: 60px;
    background-color: #388E3C;
    border-radius: 0 100% 0 0;
  }

  &::before {
    left: -20px;
    transform: rotate(-20deg);
  }

  &::after {
    right: -20px;
    transform: rotate(20deg);
  }
`;

const StyledCard = styled(Card)`
  background-color: ${props => props.isDarkMode ? '#333' : '#fff'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  border: none;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledButton = styled(Button)`
  background-color: rgba(76, 175, 80, 0.75);
  border: none;
  color: white;
  padding: 15px 32px;
  margin: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  background-color: rgba(69, 160, 73, 0.75);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(2px);
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0.5;
    filter: blur(10px);
    transform: rotate(45deg);
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 0.7;
  }

  backdrop-filter: blur(5px);
  border-radius: 12px;
`;

const Home = ({ isDarkMode }) => {
    const [featuredPets, setFeaturedPets] = useState([]);
    const [recentArticles, setRecentArticles] = useState([]);
    const [petsCount, setPetsCount] = useState(0);
    const [articlesCount, setArticlesCount] = useState(0);
    const [accesoriesCount, setAccesoriesCount] = useState(0);
    const [advertCount, setAdvertCount] = useState(0);
    
    const { ref: statsRef, inView: statsInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedPets();
        fetchRecentArticles();
        fetchAdverts();
        fetchAccesories();
    }, []);

    const fetchFeaturedPets = async () => {
        try {
            const response = await getAllPets();
            setPetsCount(response.data.pets.length||0);
            setFeaturedPets(response.data.pets.slice(0, 4)); // Get first 4 pets
        } catch (error) {
            toast.error('Failed to fetch featured pets');
        }
    };

    const fetchRecentArticles = async () => {
        try {
            const response = await getAllArticles();
            setArticlesCount(response.data.articles.length||0);
            setRecentArticles(response.data.articles.slice(0, 3)); // Get first 3 articles
        } catch (error) {
            toast.error('Failed to fetch recent articles');
        }
    };

    const fetchAdverts = async () => {
        try {
            const response = await getAllAdverts();
            setAdvertCount(response.data.adverts.length||0);
        } catch (error) {
            toast.error('Failed to fetch adverts');
        }
    };

    const fetchAccesories = async () => {
        try {
            const response = await getAllAccessories();
            setAccesoriesCount(response.data.accessories.length||0);
        } catch (error) {
            toast.error('Failed to fetch accesories');
        }
    };

    const handleFeatureClick = (path) => {
        navigate(path);
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <StyledHome isDarkMode={isDarkMode}>
            <HeroSection isDarkMode={isDarkMode}>
                <HeroImage src="https://plus.unsplash.com/premium_photo-1667727016930-254656347847?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <Container>
                    <Row>
                        <Col md={6}>
                            <HeroContent>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Find Your Perfect Pet Companion</h1>
                                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Discover, connect, and bring joy to your home with Pets4Home - your trusted pet marketplace.</p>
                                    <StyledButton as={Link} to="/search" size="lg">
                                        Start Your Search
                                    </StyledButton>
                                </motion.div>
                            </HeroContent>
                        </Col>
                    </Row>
                </Container>
            </HeroSection>

            <Section>
                <Container>
                    <h2 className="text-center mb-5">Why Choose Pets4Home?</h2>
                    <Row>
                        {[
                            { icon: <FaSearch />, title: 'Easy Search', description: 'Find your perfect pet with our advanced search options.', path: '/search' },
                            { icon: <FaPlus />, title: 'Post Ads', description: 'List your pets or pet-related services with ease.', path: '/add-advert' },
                            { icon: <FaComments />, title: 'Direct Messaging', description: 'Connect directly with pet owners and adopters.', path: '/messages' },
                            { icon: <FaBookOpen />, title: 'Knowledge Hub', description: 'Access valuable pet care information and tips.', path: '/knowledge-hub' },
                        ].map((feature, index) => (
                            <Col key={index} md={3} sm={6} className="mb-4">
                                <GlassmorphicCard
                                    isDarkMode={isDarkMode}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleFeatureClick(feature.path)}
                                >
                                    <FeatureIcon>{feature.icon}</FeatureIcon>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </GlassmorphicCard>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Section>

            <Section style={{backgroundColor: isDarkMode ? '#222' : '#f8f9fa'}}>
                <Container>
                    <h2 className="text-center mb-5" style={{color: isDarkMode ? '#fff' : '#333'}}>Featured Pets</h2>
                    <Slider {...sliderSettings}>
                        {featuredPets.map(pet => (
                            <div key={pet._id} className="px-2">
                                <StyledCard isDarkMode={isDarkMode}>
                                    <Card.Img variant="top" src={pet.images[0]} alt={pet.name} style={{ height: '200px', objectFit: 'cover' }} />
                                    <Card.Body>
                                        <Card.Title>{pet.name}</Card.Title>
                                        <Card.Text>{pet.breed}</Card.Text>
                                        <StyledButton as={Link} to={`/search`} variant="outline-primary">View Details</StyledButton>
                                    </Card.Body>
                                </StyledCard>
                            </div>
                        ))}
                    </Slider>
                </Container>
            </Section>

            <StatsSection ref={statsRef} isDarkMode={isDarkMode}>
                <Container>
                    <Row>
                        {[
                            { value: petsCount, label: 'Happy Pets' },
                            { value: accesoriesCount , label: '+ Accessories' },
                            { value: articlesCount, label: 'Knowledge Articles' },
                            { value: advertCount, label: '+ Adverts' },
                        ].map((stat, index) => (
                            <Col key={index} md={3} sm={6} className="mb-4">
                                <StatCard isDarkMode={isDarkMode}>
                                    <StatIcon />
                                    <StatValue>
                                        {statsInView && (
                                            <CountUp end={stat.value} duration={2.5} separator="," />
                                        )}
                                        {!statsInView && '0'}
                                    </StatValue>
                                    <StatLabel isDarkMode={isDarkMode}>{stat.label}</StatLabel>
                                </StatCard>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </StatsSection>

            <Section style={{backgroundColor: isDarkMode ? '#2c2c2c' : '#fff'}}>
                <Container>
                    <h2 className="text-center mb-5" style={{color: isDarkMode ? '#fff' : '#333'}}>From Our Knowledge Hub</h2>
                    <Row>
                        {recentArticles.map(article => (
                            <Col key={article._id} md={4} className="mb-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <StyledCard isDarkMode={isDarkMode}>
                                        <Card.Img variant="top" src={article.images[0]} alt={article.title} style={{ height: '200px', objectFit: 'cover' }} />
                                        <Card.Body>
                                            <Card.Title>{article.title}</Card.Title>
                                            <StyledButton as={Link} to={`/knowledge-hub-details/${article._id}`} variant="link">Read More</StyledButton>
                                        </Card.Body>
                                    </StyledCard>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                    <div className="text-center mt-4">
                        <StyledButton as={Link} to="/knowledge-hub" variant="outline-primary" size="lg">Explore Knowledge Hub</StyledButton>
                    </div>
                </Container>
            </Section>
            <CTASection>
  <Container className="text-center" style={{ position: 'relative', zIndex: 1 }}>
    <h2 className="mb-4">Ready to Find Your Perfect Pet?</h2>
    <p className="mb-4">Join our community of pet lovers and start your journey today!</p>
    <StyledButton as={Link} to="/search" variant="light" size="lg" className="me-3">Buy Pets & Accessories</StyledButton>
    <Button as={Link} to="/add-advert" variant="outline-light" size="lg">Post an Ad</Button>
  </Container>
  <GrassBlade style={{ left: '5%' }} />
  <GrassBlade style={{ left: '25%', height: '70px' }} />
  <GrassBlade style={{ left: '45%' }} />
  <GrassBlade style={{ left: '65%', height: '90px' }} />
  <GrassBlade style={{ left: '85%' }} />
</CTASection>
        </StyledHome>
    );
};

Home.propTypes = {
    isDarkMode: PropTypes.bool.isRequired
};

export default Home;