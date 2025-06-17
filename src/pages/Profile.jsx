import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image, Card, ListGroup, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { BsPencil, BsCheckCircleFill } from 'react-icons/bs';
import profileIcon from '../assets/profile.png';
import { getUserProfile, updateUserProfile } from '../contexts/api'; // Update these import names
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import {toast} from 'react-toastify';

const StyledContainer = styled(Container)`
  margin-top: 80px;
  padding-bottom: 40px;
`;

const PageWrapper = styled.div`
  background: linear-gradient(to bottom, var(--background-light), var(--background-highlight));
  min-height: 100vh;
  padding: 20px 0;
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-highlight) 100%);
  border: 1px solid rgba(251, 194, 31, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, var(--background-highlight) 0%, var(--secondary-lighter) 100%);
  }
  
  &.active {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
    border-color: var(--primary) !important;
    color: #ffffff !important;
  }
`;

const ProfileCard = styled(Card)`
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-highlight) 100%);
  border: 1px solid rgba(251, 194, 31, 0.1);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const ProfileImage = styled(Image)`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 3px solid var(--primary-light);
  border-radius: 50%;
`;

const EditIcon = styled(BsPencil)`
  cursor: pointer;
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: var(--primary);
  color: white;
  border-radius: 50%;
  padding: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
    transform: scale(1.1);
  }
`;

const FormSection = styled(Card)`
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-highlight) 100%);
  border: 1px solid rgba(251, 194, 31, 0.1);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const SectionTitle = styled(Card.Title)`
  color: var(--primary);
  font-weight: 600;
  border-bottom: 1px solid rgba(251, 194, 31, 0.3);
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const StyledFormLabel = styled(Form.Label)`
  color: var(--primary);
  font-weight: 500;
`;

const StyledFormControl = styled(Form.Control)`
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 10px 15px;
  
  &:focus {
    border-color: var(--primary-light);
    box-shadow: 0 0 0 0.2rem rgba(215, 118, 32, 0.25);
  }
`;

const StyledCheckbox = styled(Form.Check)`
  .form-check-input:checked {
    background-color: var(--primary);
    border-color: var(--primary);
  }
  
  .form-check-label {
    color: var(--primary-dark);
  }
`;

const UpdateButton = styled(Button)`
  background: var(--primary);
  border: none;
  padding: 10px 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }
`;

const CompletionBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-weight: 500;
  margin-top: 10px;
  
  svg {
    margin-right: 5px;
  }
`;

const Profile = ({ isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    state: '',
    postalCode: '',
    showNumberOnProfile: false,
    profileCompletionPercentage: 0,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getUserProfile(); // Use getUserProfile instead of getProfile
      setUserData(response.data.user);
    } catch (error) {
      setError('Failed to fetch profile data');
    }finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    try {

      await updateUserProfile(userData); // Use updateUserProfile instead of updateProfile
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      setError('Failed to update profile');
    }finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };


  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
        navigate('/')
      window.location.reload();
    }, 1000);
  };

  return (
    <PageWrapper>
      <StyledContainer>
        <h1 className="mb-4" style={{ color: 'var(--primary)' }}>My Account</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
          <Col md={3}>
            <ProfileCard>
              <Card.Body>
                <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
                  <ProfileImage src={profileIcon} />
                  <EditIcon />
                </div>
                <Card.Title className="text-center mt-3" style={{ color: 'var(--primary-dark)' }}>
                  {userData.name?.toUpperCase()}
                </Card.Title>
                {userData.profileCompletionPercentage === 100 && (
                  <CompletionBadge>
                    <BsCheckCircleFill /> Profile Complete
                  </CompletionBadge>
                )}
              </Card.Body>
              <ListGroup variant="flush">
                <StyledListGroupItem action onClick={() => navigate('/profile')} active>My Account</StyledListGroupItem>
                <StyledListGroupItem action onClick={() => navigate('/messages')}>Messages</StyledListGroupItem>
                <StyledListGroupItem action onClick={() => navigate('/add-advert', { state: { tab: 'my-adverts' } })}>My Adverts</StyledListGroupItem>
                <StyledListGroupItem action onClick={() => navigate('/add-advert', { state: { tab: 'favourite-adverts' } })}>Favourite Adverts</StyledListGroupItem>
                <StyledListGroupItem action onClick={handleLogout}>Log Out</StyledListGroupItem>
              </ListGroup>
            </ProfileCard>
          </Col>
          <Col md={9} className='mb-4'>
            <FormSection>
              <Card.Body>
                <SectionTitle>General Information</SectionTitle>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <StyledFormLabel>Name</StyledFormLabel>
                        <StyledFormControl 
                          type="text" 
                          name="name"
                          value={userData.name} 
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <StyledFormLabel>Email</StyledFormLabel>
                        <StyledFormControl 
                          type="email" 
                          name="email"
                          value={userData.email} 
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <SectionTitle className="mt-4">Contact Details</SectionTitle>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <StyledFormLabel>Country</StyledFormLabel>
                        <StyledFormControl 
                          type="text" 
                          name="country"
                          value={userData.country} 
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <StyledFormLabel>State</StyledFormLabel>
                        <StyledFormControl 
                          type="text" 
                          name="state"
                          value={userData.state} 
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <StyledFormLabel>Phone Number</StyledFormLabel>
                        <StyledFormControl 
                          type="text" 
                          name="phoneNumber"
                          value={userData.phoneNumber} 
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <StyledFormLabel>Postal Code</StyledFormLabel>
                        <StyledFormControl 
                          type="text" 
                          name="postalCode"
                          value={userData.postalCode} 
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <StyledCheckbox 
                      type="checkbox" 
                      label="Show phone number on my profile" 
                      checked={userData.showNumberOnProfile}
                      onChange={() => setUserData({ ...userData, showNumberOnProfile: !userData.showNumberOnProfile })}
                    />
                  </Form.Group>
                
                  <UpdateButton type="submit" className="mt-3">
                    Update Profile
                  </UpdateButton>
                
                </Form>
              </Card.Body>
            </FormSection>
            {userData.profileCompletionPercentage < 100 && (
              <Alert 
                variant="warning" 
                className="mt-3" 
                style={{ 
                  backgroundColor: 'var(--secondary-lighter)', 
                  color: 'var(--primary-dark)', 
                  borderColor: 'var(--secondary)'
                }}
              >
                Your profile is {userData.profileCompletionPercentage}% complete. Please fill in the missing information to complete your profile.
              </Alert>
            )}
          </Col>
        </Row>
        {loading && <Loader />}
      </StyledContainer>
    </PageWrapper>
  );
};

export default Profile;