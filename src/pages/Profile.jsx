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
`;
const StyledListGroupItem = styled(ListGroup.Item)`
  &.active {
    background-color: #0a6638 !important;
    border-color: #0a6638 !important;
    color: #ffffff !important;
  }
`;
const ProfileImage = styled(Image)`
  width: 150px;
  height: 150px;
  object-fit: cover;
`;

const EditIcon = styled(BsPencil)`
  cursor: pointer;
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: white;
  border-radius: 50%;
  padding: 5px;
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
    <StyledContainer>
      <h1 className="mb-4">My Account</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={3}>
          <Card bg={isDarkMode ? 'dark' : 'light'} text={isDarkMode ? 'light' : 'dark'}>
            <Card.Body>
              <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
                <ProfileImage src={profileIcon}  />
                <EditIcon />
              </div>
              <Card.Title className="text-center mt-3">{userData.name?.toUpperCase()}</Card.Title>
              {userData.profileCompletionPercentage === 100 && (
                <div className="text-center text-success">
                  <BsCheckCircleFill /> Profile Complete
                </div>
              )}
            </Card.Body>
            <ListGroup variant="flush">
  <StyledListGroupItem action onClick={() => navigate('/profile')} active>My Account</StyledListGroupItem>
  <StyledListGroupItem action onClick={() => navigate('/messages')} >Messages</StyledListGroupItem>
  <StyledListGroupItem action onClick={() => navigate('/add-advert', { state: { tab: 'my-adverts' } })}>My Adverts</StyledListGroupItem>
  <StyledListGroupItem action onClick={() => navigate('/add-advert', { state: { tab: 'favourite-adverts' } })}>Favourite Adverts</StyledListGroupItem>
  <StyledListGroupItem action onClick={handleLogout}>Log Out</StyledListGroupItem>
</ListGroup>
          </Card>
        </Col>
        <Col md={9} className='mb-4'>
          <Card bg={isDarkMode ? 'dark' : 'light'} text={isDarkMode ? 'light' : 'dark'}>
            <Card.Body>
              <Card.Title>General Information</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="name"
                        value={userData.name} 
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        value={userData.email} 
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Title className="mt-4">Contact Details</Card.Title>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="country"
                        value={userData.country} 
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control 
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
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="phoneNumber"
                        value={userData.phoneNumber} 
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Postal Code</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="postalCode"
                        value={userData.postalCode} 
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    label="Show phone number on my profile" 
                    checked={userData.showNumberOnProfile}
                    onChange={() => setUserData({ ...userData, showNumberOnProfile: !userData.showNumberOnProfile })}
                  />
                </Form.Group>
              
                  <Button type="submit" className="mt-3" variant="primary" >
                    Update Profile
                  </Button>
              
              </Form>
            </Card.Body>
          </Card>
          {userData.profileCompletionPercentage < 100 && (
            <Alert variant="info" className="mt-3">
              Your profile is {userData.profileCompletionPercentage}% complete. Please fill in the missing information to complete your profile.
            </Alert>
          )}
        </Col>
      </Row>
      {loading && <Loader />}
    </StyledContainer>
  );
};

export default Profile;