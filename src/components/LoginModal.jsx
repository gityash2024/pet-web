import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaGoogle, FaArrowLeft, FaEnvelope, FaMobile, FaUser, FaLock } from 'react-icons/fa';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import OtpInput from 'react-otp-input';
import { GoogleLogin } from '@react-oauth/google';
import Loader from './Loader/Loader';
import { toast } from 'react-toastify';
import { loginUser, googleAuth, generateOTP, verifyOTP, registerUser } from '../contexts/api';
import profileImage from '../assets/profile.png';
// Replace the StyledOTP styled component with this:
const StyledOTP = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin: 2rem 0;

  input {
    width: 3.5rem !important;
    height: 3.5rem !important;
    font-size: 1.5rem;
    border-radius: 10px;
    border: 1px solid ${props => props.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
    background: ${props => props.isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff'};
    color: ${props => props.isDarkMode ? '#fff' : '#333'};
    text-align: center;

    &:focus {
      border-color: #0a6638;
      outline: none;
      box-shadow: 0 0 0 0.2rem rgba(10,102,56,0.25);
    }
  }
`;

const OTPContainer = styled.div`
  text-align: center;
  padding: 2rem 1rem;
`;

const OTPHeader = styled.h5`
  margin-bottom: 0.5rem;
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
`;

const OTPSubtext = styled.p`
  color: ${props => props.isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'};
  margin-bottom: 2rem;
`;

const PasteButton = styled(Button)`
  background: transparent;
  border: 1px solid #0a6638;
  color: #ffffff;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  
  &:hover {
    background: rgba(10,102,56,0.1);
    border-color: #0a6638;
    color: #ffffff;
  }
`;

const StyledModal = styled(Modal)`
 .modal-content {
   background: ${props => props.isDarkMode ? '#222' : '#fff'};
   color: ${props => props.isDarkMode ? '#fff' : '#333'};
   border-radius: 20px;
   overflow: hidden;
   border: 1px solid ${props => props.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
 }
 
 .modal-header {
   border-bottom: none;
   padding: 1.5rem;
 }
`;

const ModalContainer = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 0 1.5rem 1.5rem;
`;

const AuthForm = styled(Form)`
 width: 100%;
 max-width: 400px;
`;

const StyledButton = styled(Button)`
 background: #0a6638;
 border: none;
 padding: 0.8rem;
 font-weight: 500;
 border-radius: 10px;
 transition: all 0.3s ease;

 &:hover {
   background: #084a29;
   transform: translateY(-2px);
 }

 &:active {
   transform: translateY(0);
 }
`;

const SocialLoginButton = styled(Button)`
 width: 100%;
 background: ${props => props.isDarkMode ? 'rgba(255,255,255,0.1)' : '#f8f9fa'};
 border: 1px solid ${props => props.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
 color:#ffffff;
 padding: 0.8rem;
 display: flex;
 align-items: center;
 justify-content: center;
 gap: 0.5rem;
 margin-bottom: 1rem;
 border-radius: 10px;
 transition: all 0.3s ease;

 &:hover {
   background: ${props => props.isDarkMode ? 'rgba(255,255,255,0.2)' : '#eee'};
   transform: translateY(-2px);
 }
`;

const Divider = styled.div`
 display: flex;
 align-items: center;
 margin: 1.5rem 0;
 color: ${props => props.isDarkMode ? '#aaa' : '#666'};
 
 &::before, &::after {
   content: '';
   flex: 1;
   border-bottom: 1px solid ${props => props.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
 }
 
 span {
   padding: 0 1rem;
   font-size: 0.9rem;
 }
`;

const AuthOption = styled.div`
 display: flex;
 gap: 1rem;
 margin-bottom: 1.5rem;
`;

const OptionButton = styled.button`
 flex: 1;
 padding: 0.8rem;
 background: ${props => props.active ? '#0a6638' : 'transparent'};
 color: ${props => props.active ? '#fff' : props.isDarkMode ? '#fff' : '#333'};
 border: 1px solid ${props => props.active ? '#0a6638' : props.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
 border-radius: 10px;
 cursor: pointer;
 transition: all 0.3s ease;
 display: flex;
 align-items: center;
 justify-content: center;
 gap: 0.5rem;

 &:hover {
   background: ${props => props.active ? '#084a29' : props.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
 }
`;

const FormSection = styled.div`
 position: relative;
 flex: 1;
`;

const ImageSection = styled.div`
 background: url(${profileImage}) center/cover no-repeat;
 border-radius: 20px;
 overflow: hidden;
 padding-top: 100%;
 position: relative;

 &::after {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: linear-gradient(to bottom, rgba(10,102,56,0.2), rgba(10,102,56,0.8));
 }
`;

const StyledInput = styled(Form.Control)`
 background: ${props => props.isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff'};
 border: 1px solid ${props => props.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
 color: ${props => props.isDarkMode ? '#fff' : '#333'};
 padding: 0.8rem;
 border-radius: 10px;

 &:focus {
   background: ${props => props.isDarkMode ? 'rgba(255,255,255,0.15)' : '#fff'};
   border-color: #0a6638;
   box-shadow: 0 0 0 0.2rem rgba(10,102,56,0.25);
 }
`;

const StyledPhoneInput = styled(PhoneInput)`
 .form-control {
   width: 100% !important;
   background: ${props => props.isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff'} !important;
   border: 1px solid ${props => props.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} !important;
   color: ${props => props.isDarkMode ? '#fff' : '#333'} !important;
   padding: 0.8rem !important;
   border-radius: 10px !important;
   height: auto !important;
 }
`;


const BackButton = styled.button`
 position: absolute;
 top: 1rem;
 left: 1rem;
 background: none;
 border: none;
 color: ${props => props.isDarkMode ? '#fff' : '#333'};
 font-size: 1.5rem;
 cursor: pointer;
 z-index: 10;
 padding: 0.5rem;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: all 0.3s ease;

 &:hover {
   background: rgba(10,102,56,0.1);
 }
`;


const LoginModal = ({ show, handleClose, isDarkMode, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePasswords = () => {
    if (!isLogin && password !== confirmPassword) {
      setPasswordsMatch(false);
      return false;
    }
    setPasswordsMatch(true);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match for registration
    if (!isLogin && !validatePasswords()) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      let response;
      
      if (isLogin) {
        if (loginMethod === 'email') {
          if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
          }
          if (!password) {
            throw new Error('Password is required');
          }
          response = await loginUser({ email, password });
        } else {
          if (phoneNumber.length < 10) {
            throw new Error('Please enter a valid phone number');
          }
          if (!showOtpInput) {
            await generateOTP({ phoneNumber });
            setShowOtpInput(true);
            toast.success('OTP sent successfully');
            setIsLoading(false);
            return;
          }
          response = await verifyOTP({ phoneNumber, otp });
        }
      } else {
        if (!name || !email || !password || !confirmPassword) {
          throw new Error('All fields are required');
        }
        if (!validateEmail(email)) {
          throw new Error('Please enter a valid email address');
        }
        response = await registerUser({ name, email, password, phoneNumber });
      }

      if (response?.data?.status === 200 && response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        handleClose();
        onLoginSuccess();
        toast.success(isLogin ? 'Logged in successfully' : 'Registered successfully');
        window.location.href = '/';
        window.location.reload();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await googleAuth({ token: credentialResponse.credential });
      if (response.status === 200 && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        handleClose();
        onLoginSuccess();
        toast.success('Logged in successfully with Google');
        window.location.href = '/';
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during Google login';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setOtp('');
    setName('');
    setError('');
    setPasswordsMatch(true);
    setShowOtpInput(false);
  };

  const toggleLoginMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <StyledModal show={show} onHide={handleClose} size="lg" centered isDarkMode={isDarkMode}>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? 'Welcome Back' : 'Create Account'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <ModalContainer>
              <AuthForm onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {/* {!passwordsMatch && <Alert variant="danger">Passwords do not match</Alert>} */}

                {!showOtpInput && (
                  <>
                    {isLogin && (
                      <AuthOption>
                        <OptionButton
                          type="button"
                          active={loginMethod === 'email'}
                          onClick={() => setLoginMethod('email')}
                          isDarkMode={isDarkMode}
                        >
                          <FaEnvelope /> Email
                        </OptionButton>
                        <OptionButton
                          type="button"
                          active={loginMethod === 'mobile'}
                          onClick={() => setLoginMethod('mobile')}
                          isDarkMode={isDarkMode}
                        >
                          <FaMobile /> Mobile
                        </OptionButton>
                      </AuthOption>
                    )}
                  </>
                )}

                <FormSection>
                {showOtpInput ? (
  <>
    <BackButton onClick={() => {setShowOtpInput(false); setOtp('');}} isDarkMode={isDarkMode}>
      <FaArrowLeft />
    </BackButton>
    <OTPContainer>
      <OTPHeader isDarkMode={isDarkMode}>Enter verification code</OTPHeader>
      <OTPSubtext isDarkMode={isDarkMode}>
        We've sent a code to {phoneNumber}
      </OTPSubtext>
      <div style={{ position: 'relative' }}>
        <StyledOTP isDarkMode={isDarkMode}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span style={{ margin: '0 0.5rem' }}></span>}
            renderInput={(props) => <input {...props} />}
            containerStyle="otp-container"
            inputStyle="otp-input"
          />
        </StyledOTP>
        <PasteButton
          style={{ 
            right: '0', 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 1,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
          }}
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              const cleanNumber = text.replace(/\D/g, '').slice(0, 6);
              if (cleanNumber.length === 6) {
                setOtp(cleanNumber);
              }
            } catch (err) {
              toast.error('Unable to paste code');
            }
          }}
        >
          Paste
        </PasteButton>
      </div>
      <Button 
        variant="link" 
        onClick={() => {
          generateOTP({ phoneNumber });
          toast.success('New OTP sent successfully');
        }}
        style={{ color: '#0a6638', marginTop: '1rem' }}
      >
        Resend code
      </Button>
    </OTPContainer>
  </>
) : (
                    <>
                      {!isLogin && (
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <StyledInput
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isDarkMode={isDarkMode}
                            required
                          />
                        </Form.Group>
                      )}

                      {(loginMethod === 'email' || !isLogin) && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <StyledInput
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              isDarkMode={isDarkMode}
                              required
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <StyledInput
                              type="password"
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              isDarkMode={isDarkMode}
                              required
                            />
                          </Form.Group>
                        </>
                      )}

                      {loginMethod === 'mobile' && (
                        <Form.Group className="mb-3">
                          <Form.Label>Mobile Number</Form.Label>
                          <StyledPhoneInput
                            country={'us'}
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            inputProps={{required: true}}
                            isDarkMode={isDarkMode}
                          />
                        </Form.Group>
                      )}

                      {!isLogin && (
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <StyledInput
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isDarkMode={isDarkMode}
                            required
                          />
                        </Form.Group>
                      )}
                    </>
                  )}

                  <StyledButton type="submit" className="w-100 mt-3" disabled={isLoading}>
                    {isLoading ? <Loader /> : 
                     showOtpInput ? 'Verify Code' : 
                     isLogin ? 'Login' : 'Create Account'}
                  </StyledButton>

                  {!showOtpInput && (
                    <p className="text-center mt-3">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <Button 
                        variant="link" 
                        onClick={toggleLoginMode}
                        className="p-0"
                      >
                        {isLogin ? 'Sign up' : 'Login'}
                      </Button>
                    </p>
                  )}
                </FormSection>
              </AuthForm>
            </ModalContainer>
          </Col>
        </Row>
      </Modal.Body>
    </StyledModal>
  );
};

LoginModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginModal;