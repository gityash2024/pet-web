import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  padding: 80px 0;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
`;

const HeaderSection = styled.div`
  background: #0a6638;
  color: white;
  padding: 60px 0;
  text-align: center;
  margin-bottom: 50px;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  p {
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ContactCard = styled(Card)`
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 25px;
  height: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .icon {
    color: #0a6638;
    font-size: 2rem;
    margin-bottom: 15px;
  }
  
  h3 {
    color: ${props => props.isDarkMode ? '#fff' : '#333'};
    font-size: 1.3rem;
    margin-bottom: 15px;
  }
  
  p {
    color: ${props => props.isDarkMode ? '#ccc' : '#666'};
    margin: 0;
  }
`;

const ContactForm = styled(Form)`
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  
  .form-control {
    background: ${props => props.isDarkMode ? '#333' : '#fff'};
    border: 1px solid ${props => props.isDarkMode ? '#444' : '#ddd'};
    color: ${props => props.isDarkMode ? '#fff' : '#333'};
    
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(10, 102, 56, 0.25);
      border-color: #0a6638;
    }
  }
`;

const SubmitButton = styled(Button)`
  background: #0a6638;
  border: none;
  padding: 10px 30px;
  
  &:hover {
    background: #084a29;
  }
`;

const ContactUs = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <HeaderSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Contact Us</h1>
            <p>Have questions about Pets4Home? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </motion.div>
        </Container>
      </HeaderSection>
      
      <Container>
        <Row className="mb-5">
          <Col md={3}>
            <ContactCard isDarkMode={isDarkMode}>
              <FaMapMarkerAlt className="icon" />
              <h3>Visit Us</h3>
              <p>123 Pet Street<br />London, UK SW1A 1AA</p>
            </ContactCard>
          </Col>
          <Col md={3}>
            <ContactCard isDarkMode={isDarkMode}>
              <FaPhone className="icon" />
              <h3>Call Us</h3>
              <p>+44 20 1234 5678<br />Mon-Fri, 9am-6pm</p>
            </ContactCard>
          </Col>
          <Col md={3}>
            <ContactCard isDarkMode={isDarkMode}>
              <FaEnvelope className="icon" />
              <h3>Email Us</h3>
              <p>support@pets4home.com<br />info@pets4home.com</p>
            </ContactCard>
          </Col>
          <Col md={3}>
            <ContactCard isDarkMode={isDarkMode}>
              <FaClock className="icon" />
              <h3>Working Hours</h3>
              <p>Monday - Friday<br />9:00 AM - 6:00 PM</p>
            </ContactCard>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <h2 className="mb-4">Send Us a Message</h2>
            <ContactForm isDarkMode={isDarkMode} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <SubmitButton type="submit">
                Send Message
              </SubmitButton>
            </ContactForm>
          </Col>
          
          <Col md={6}>
            <h2 className="mb-4">Find Us</h2>
            <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.542352678662!2d-0.12985968422955556!3d51.50073891882416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c38c8cd1d9%3A0xb78f2474b9a45aa9!2sBig%20Ben!5e0!3m2!1sen!2sin!4v1635959811256!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </PageContainer>
  );
};

export default ContactUs;