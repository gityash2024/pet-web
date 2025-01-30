import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPaw, FaShieldAlt, FaHeart, FaUsers } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import teamMember1 from '../assets/profile.png';
import teamMember2 from '../assets/profile.png';
import teamMember3 from '../assets/profile.png';

const PageContainer = styled.div`
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  min-height: 100vh;
`;

const HeroSection = styled.div`
  background: #0a6638;
  color: white;
  padding: 80px 0;
  text-align: center;
`;

const Section = styled.div`
  padding: 80px 0;
`;

const ValueCard = styled(motion.div)`
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;

  svg {
    font-size: 40px;
    color: #0a6638;
    margin-bottom: 20px;
  }

  h3 {
    margin-bottom: 15px;
    color: ${props => props.isDarkMode ? '#fffacc' : '#0a6638'};
  }
`;

const TeamCard = styled(motion.div)`
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .content {
    padding: 20px;
    text-align: center;
  }

  h4 {
    color: ${props => props.isDarkMode ? '#fffacc' : '#0a6638'};
    margin-bottom: 5px;
  }

  p {
    color: ${props => props.isDarkMode ? '#ccc' : '#666'};
    margin-bottom: 0;
  }
`;

const StyledTitle = styled.h2`
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  margin-bottom: 50px;
  text-align: center;
  font-size: 2.2rem;
`;

const AboutUs = ({ isDarkMode }) => {
  const values = [
    {
      icon: <FaPaw />,
      title: "Pet-First Approach",
      description: "We prioritize the well-being and happiness of every pet in our community."
    },
    {
      icon: <FaShieldAlt />,
      title: "Safe & Secure",
      description: "Our platform ensures secure transactions and verified pet listings for peace of mind."
    },
    {
      icon: <FaHeart />,
      title: "Passionate Care",
      description: "We're driven by our love for animals and commitment to their welfare."
    },
    {
      icon: <FaUsers />,
      title: "Community Focus",
      description: "Building a supportive community of pet lovers, owners, and care providers."
    }
  ];

  const team = [
    {
      image: teamMember1,
      name: "John Doe",
      position: "CEO & Founder"
    },
    {
      image: teamMember2,
      name: "Jane Smith",
      position: "Head of Pet Care"
    },
    {
      image: teamMember3,
      name: "Mike Johnson",
      position: "Community Manager"
    }
  ];

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <HeroSection>
        <Container>
          <h1>About Pets4Home</h1>
          <p className="lead mt-3">
            Creating happy homes for pets and their families since 2020
          </p>
        </Container>
      </HeroSection>

      <Section>
        <Container>
          <StyledTitle isDarkMode={isDarkMode}>Our Story</StyledTitle>
          <Row className="justify-content-center">
            <Col md={8}>
              <p className="text-center mb-5">
                Pets4Home was founded with a simple mission: to create a safe and trusted platform where pets can find their forever homes. What started as a small community has grown into a nationwide network of pet lovers, trusted breeders, and passionate animal welfare advocates.
              </p>
            </Col>
          </Row>

          <StyledTitle isDarkMode={isDarkMode}>Our Values</StyledTitle>
          <Row>
            {values.map((value, index) => (
              <Col md={3} key={index} className="mb-4">
                <ValueCard 
                  isDarkMode={isDarkMode}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {value.icon}
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </ValueCard>
              </Col>
            ))}
          </Row>
        </Container>
      </Section>

      <Section style={{ background: isDarkMode ? '#222' : '#fff' }}>
        <Container>
          <StyledTitle isDarkMode={isDarkMode}>Meet Our Team</StyledTitle>
          <Row>
            {team.map((member, index) => (
              <Col md={4} key={index}>
                <TeamCard 
                  isDarkMode={isDarkMode}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img src={member.image} alt={member.name} />
                  <div className="content">
                    <h4>{member.name}</h4>
                    <p>{member.position}</p>
                  </div>
                </TeamCard>
              </Col>
            ))}
          </Row>
        </Container>
      </Section>

      <Section style={{ background: '#0a6638', color: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="mb-4">Our Mission</h2>
              <p>To create a world where every pet has a loving home and every pet owner has access to the resources they need to provide the best care possible.</p>
            </Col>
            <Col md={6}>
              <h2 className="mb-4">Our Vision</h2>
              <p>To be the most trusted platform for pet adoption and pet care resources, building a community that prioritizes animal welfare and responsible pet ownership.</p>
            </Col>
          </Row>
        </Container>
      </Section>
    </PageContainer>
  );
};

export default AboutUs;