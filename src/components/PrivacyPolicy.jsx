import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

const PageContainer = styled.div`
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  min-height: 100vh;
  padding: 80px 0;
`;

const HeaderSection = styled.div`
  background: #0a6638;
  color: white;
  padding: 40px 0;
  margin: -80px 0 50px;
  text-align: center;

  svg {
    font-size: 48px;
    color: #fffacc;
    margin-bottom: 20px;
  }
`;

const ContentSection = styled(motion.div)`
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const StyledTitle = styled.h1`
  color: #fff;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #0a6638;
  margin: 30px 0 20px;
  font-size: 1.8rem;
`;

const SubTitle = styled.h3`
  color: ${props => props.isDarkMode ? '#fffacc' : '#0a6638'};
  margin: 20px 0 15px;
  font-size: 1.4rem;
`;

const LastUpdated = styled.p`
  color: #fffacc;
  text-align: center;
  font-style: italic;
`;

const DataList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;

    &:before {
      content: "•";
      color: #0a6638;
      position: absolute;
      left: 0;
    }
  }
`;

const PrivacyPolicy = ({ isDarkMode }) => {
  return (
    <PageContainer isDarkMode={isDarkMode}>
      <HeaderSection>
        <Container>
          <FaShieldAlt />
          <StyledTitle>Privacy Policy</StyledTitle>
          <LastUpdated>Last updated: January 31, 2025</LastUpdated>
        </Container>
      </HeaderSection>

      <Container>
        <ContentSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          isDarkMode={isDarkMode}
        >
          <SectionTitle>1. Information We Collect</SectionTitle>
          <SubTitle isDarkMode={isDarkMode}>1.1 Personal Information</SubTitle>
          <p>We collect the following types of personal information:</p>
          <DataList>
            <li>Name and contact details</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Address and location data</li>
            <li>Payment information</li>
          </DataList>

          <SubTitle isDarkMode={isDarkMode}>1.2 Pet Information</SubTitle>
          <p>When listing pets, we collect:</p>
          <DataList>
            <li>Pet photos and descriptions</li>
            <li>Pet health records</li>
            <li>Breeding information</li>
            <li>Vaccination records</li>
          </DataList>

          <SectionTitle>2. How We Use Your Information</SectionTitle>
          <p>Your information is used to:</p>
          <DataList>
            <li>Facilitate pet adoptions and sales</li>
            <li>Process payments</li>
            <li>Verify user identities</li>
            <li>Send service updates and notifications</li>
            <li>Improve our platform and services</li>
          </DataList>

          <SectionTitle>3. Information Sharing</SectionTitle>
          <p>We may share your information with:</p>
          <DataList>
            <li>Other users (for pet transactions)</li>
            <li>Payment processors</li>
            <li>Service providers</li>
            <li>Legal authorities when required</li>
          </DataList>

          <SectionTitle>4. Data Security</SectionTitle>
          <p>We protect your data through:</p>
          <DataList>
            <li>Encryption of sensitive information</li>
            <li>Regular security audits</li>
            <li>Access controls and monitoring</li>
            <li>Secure data storage</li>
          </DataList>

          <SectionTitle>5. Your Rights</SectionTitle>
          <p>You have the right to:</p>
          <DataList>
            <li>Access your personal data</li>
            <li>Request data correction</li>
            <li>Delete your account</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </DataList>

          <SectionTitle>6. Cookies and Tracking</SectionTitle>
          <p>We use cookies and similar technologies to:</p>
          <DataList>
            <li>Remember your preferences</li>
            <li>Analyze site traffic</li>
            <li>Personalize content</li>
            <li>Improve user experience</li>
          </DataList>

          <SectionTitle>7. Children's Privacy</SectionTitle>
          <p>Our services are not intended for users under 18. We do not knowingly collect data from children.</p>

          <SectionTitle>8. Changes to Privacy Policy</SectionTitle>
          <p>We may update this policy periodically. Users will be notified of significant changes.</p>

          <SectionTitle>9. Contact Us</SectionTitle>
          <p>For privacy-related inquiries, contact us at:</p>
          <p>Email: privacy@pets4home.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Pet Street, NY 10001</p>
        </ContentSection>
      </Container>
    </PageContainer>
  );
};

export default PrivacyPolicy;