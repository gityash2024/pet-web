import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGavel } from 'react-icons/fa';

const PageContainer = styled.div`
  background: ${props => props.isDarkMode 
    ? '#1a1a1a' 
    : 'linear-gradient(135deg, #f8f8f8 0%, var(--background-highlight) 100%)'};
  color: ${props => props.isDarkMode ? '#fff' : 'var(--text-dark)'};
  min-height: 100vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isDarkMode 
      ? 'none' 
      : 'radial-gradient(circle at top right, rgba(251, 194, 31, 0.15) 0%, transparent 70%), radial-gradient(circle at bottom left, rgba(192, 49, 21, 0.08) 0%, transparent 70%)'};
    z-index: 0;
    pointer-events: none;
  }
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(251, 194, 31, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
  
  svg {
    font-size: 48px;
    color: var(--secondary);
    margin-bottom: 20px;
  }
`;

const ContentSection = styled(motion.div)`
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 50px 0;
  position: relative;
  z-index: 1;
`;

const StyledTitle = styled.h1`
  color: #fff;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: var(--primary);
  margin: 30px 0 20px;
  font-size: 1.8rem;
`;

const SubTitle = styled.h3`
  color: ${props => props.isDarkMode ? 'var(--secondary)' : 'var(--primary)'};
  margin: 20px 0 15px;
  font-size: 1.4rem;
`;

const LastUpdated = styled.p`
  color: var(--secondary-light);
  text-align: center;
  font-style: italic;
`;

const TermsAndConditions = ({ isDarkMode }) => {
  return (
    <PageContainer isDarkMode={isDarkMode}>
      <HeroSection>
        <Container>
          <FaGavel />
          <StyledTitle>Terms and Conditions</StyledTitle>
          <LastUpdated>Last updated: January 31, 2025</LastUpdated>
        </Container>
      </HeroSection>

      <Container>
        <ContentSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          isDarkMode={isDarkMode}
        >
          <Row>
            <Col>
              <SectionTitle>1. Introduction</SectionTitle>
              <p>Welcome to PETXMAFIA. By using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before using our platform.</p>

              <SectionTitle>2. Definitions</SectionTitle>
              <p>"Platform" refers to the PETXMAFIA website and all related services.</p>
              <p>"User" refers to any person who accesses or uses the Platform.</p>
              <p>"Content" refers to any information, text, graphics, or other materials uploaded to the Platform.</p>

              <SectionTitle>3. Account Registration</SectionTitle>
              <SubTitle isDarkMode={isDarkMode}>3.1 Account Creation</SubTitle>
              <p>Users must provide accurate, current, and complete information during registration.</p>
              <SubTitle isDarkMode={isDarkMode}>3.2 Account Security</SubTitle>
              <p>Users are responsible for maintaining the confidentiality of their account credentials.</p>

              <SectionTitle>4. Pet Listings</SectionTitle>
              <SubTitle isDarkMode={isDarkMode}>4.1 Listing Requirements</SubTitle>
              <p>All pet listings must comply with local and national laws regarding pet sales and adoption.</p>
              <SubTitle isDarkMode={isDarkMode}>4.2 Accuracy of Information</SubTitle>
              <p>Users must provide accurate information about pets listed for sale or adoption.</p>

              <SectionTitle>5. User Conduct</SectionTitle>
              <p>Users agree to:</p>
              <ul>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect the rights of other users</li>
                <li>Not engage in fraudulent or deceptive practices</li>
                <li>Not post false or misleading information</li>
              </ul>

              <SectionTitle>6. Payment Terms</SectionTitle>
              <p>All transactions must be processed through our approved payment methods.</p>
              <p>Service fees are non-refundable unless otherwise specified.</p>

              <SectionTitle>7. Animal Welfare</SectionTitle>
              <p>Users must:</p>
              <ul>
                <li>Ensure proper care and treatment of animals</li>
                <li>Comply with animal welfare regulations</li>
                <li>Report any suspected abuse or neglect</li>
              </ul>

              <SectionTitle>8. Liability</SectionTitle>
              <p>PETXMAFIA is not liable for:</p>
              <ul>
                <li>Actions of users on the platform</li>
                <li>Quality or health of pets listed</li>
                <li>Disputes between users</li>
              </ul>

              <SectionTitle>9. Termination</SectionTitle>
              <p>We reserve the right to terminate or suspend accounts that violate these terms.</p>

              <SectionTitle>10. Changes to Terms</SectionTitle>
              <p>We may modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.</p>
            </Col>
          </Row>
        </ContentSection>
      </Container>
    </PageContainer>
  );
};

export default TermsAndConditions;