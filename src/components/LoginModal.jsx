import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaGoogle, FaArrowLeft } from 'react-icons/fa';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OtpInput from 'react-otp-input';
import { GoogleLogin } from '@react-oauth/google';
import Loader from './Loader/Loader';
import { toast } from 'react-toastify';
import { loginUser, googleAuth, generateOTP, verifyOTP, registerUser } from '../contexts/api';

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${props => props.isDarkMode ? '#333' : '#fff'};
    color: ${props => props.isDarkMode ? '#fff' : '#333'};
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginForm = styled(Form)`
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled(Button)`
  background-color: #4CAF50;
  border: none;
  &:hover {
    background-color: #45a049;
  }
`;

const SocialButton = styled(Button)`
  width: 100%;
  margin-bottom: 10px;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: ${props => props.isDarkMode ? '#ccc' : '#666'};

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#ccc' : '#666'};
  }

  span {
    padding: 0 10px;
  }
`;

const HeroImage = styled.div`
  background-image: url('https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&q=80&w=1170&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  height: 100%;
  border-radius: 4px 0 0 4px;
`;

const StyledOtpInput = styled(OtpInput)`
  justify-content: space-between;
  margin-bottom: 15px;
  input {
    width: 4rem !important;
    height: 4rem;
    margin: 0 0.5rem;
    font-size: 2rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
`;

const BackButton = styled(Button)`
  background: none;
  border: none;
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  padding: 0;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  left: 10px;
  &:hover, &:focus {
    color: #4CAF50;
    background: none;
    border: none;
  }
`;

const LoginModal = ({ show, handleClose, isDarkMode, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isLogin) {
      try {
        let response;
        if (loginMethod === 'email') {
          if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
          }
          if (!password) {
            setError('Password is required');
            setIsLoading(false);
            return;
          }
          response = await loginUser({ email, password });

        } else if (loginMethod === 'mobile') {
          if (phoneNumber.length < 10) {
            setError('Please enter a valid phone number');
            setIsLoading(false);
            return;
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
        console.table(response.data);
        if (response?.data?.status === 200 && response?.data?.token) {
          localStorage.setItem('token', response?.data?.token);
          localStorage.setItem('user', JSON.stringify(response?.data?.user));
          handleClose();
          onLoginSuccess();
          toast.success('Logged in successfully');
          window.location.href = '/';
          window.location.reload();
        }
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.message === 'Invalid OTP') {
          setError('Invalid OTP');
        } else {
          setError(err.response?.data?.message || 'An error occurred during login');
        }
        toast.error(err.response?.data?.message || 'An error occurred during login');
      }
    } else {
      try {
        if (!name || !email || !password || !phoneNumber) {
          setError('All fields are required');
          setIsLoading(false);
          return;
        }
        if (!validateEmail(email)) {
          setError('Please enter a valid email address');
          setIsLoading(false);
          return;
        }
        const response = await registerUser({ name, email, password, phoneNumber });
        if (response?.data?.status === 200 && response?.data.token) {
          localStorage.setItem('token', response?.data.token);
          localStorage.setItem('user', JSON.stringify(response?.data?.user));

          handleClose();
          onLoginSuccess();
          toast.success('Registered successfully');
          window.location.href = '/';
          window.location.reload();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred during registration');
        toast.error(err.response?.data?.message || 'An error occurred during registration');
      }
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await googleAuth({ token: credentialResponse.credential });
      if (response.status === 200 && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));

        handleClose();
        onLoginSuccess();
        toast.success('Logged in successfully with Google');
        window.location.href = '/';owner
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during Google login');
      toast.error(err.response?.data?.message || 'An error occurred during Google login');
    }
    setIsLoading(false);
  };

  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    setError('');
    setShowOtpInput(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await generateOTP({ phoneNumber });
      toast.success('OTP resent successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while resending OTP');
      toast.error(err.response?.data?.message || 'An error occurred while resending OTP');
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    setShowOtpInput(false);
    setOtp('');
  };

  return (
    <StyledModal show={show} onHide={handleClose} size="lg" centered isDarkMode={isDarkMode}>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? 'Login to Pets4Home' : 'Register for Pets4Home'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6} className="d-none d-md-block">
            <HeroImage />
          </Col>
          <Col md={6}>
            <LoginContainer>
              <LoginForm onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                
                {isLogin && !showOtpInput && (
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      setError('Google Login Failed');
                      toast.error('Google Login Failed');
                    }}
                    render={renderProps => (
                      <SocialButton onClick={renderProps.onClick} disabled={renderProps.disabled} variant="light">
                        <FaGoogle /> Login with Google
                      </SocialButton>
                    )}
                  />
                )}

                {isLogin && !showOtpInput && (
                  <OrDivider isDarkMode={isDarkMode}>
                    <span>OR</span>
                  </OrDivider>
                )}

                {isLogin && !showOtpInput && (
                  <Form.Group className="mb-3">
                    <Form.Check
                      inline
                      type="radio"
                      label="Email"
                      name="loginMethod"
                      id="email"
                      checked={loginMethod === 'email'}
                      onChange={() => setLoginMethod('email')}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Mobile"
                      name="loginMethod"
                      id="mobile"
                      checked={loginMethod === 'mobile'}
                      onChange={() => setLoginMethod('mobile')}
                    />
                  </Form.Group>
                )}

                {(!isLogin || (loginMethod === 'email' && !showOtpInput)) && (
                  <>
                    {!isLogin && (
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                {(!isLogin || (loginMethod === 'mobile' && !showOtpInput)) && (
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <PhoneInput
                      country={'us'}
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      inputProps={{
                        required: true,
                      }}
                    />
                  </Form.Group>
                )}

                {showOtpInput && (
                  <>
                    <BackButton onClick={handleBack} isDarkMode={isDarkMode}>
                      <FaArrowLeft />
                    </BackButton>
                    <Form.Group className="mb-3">
                      <Form.Label>Enter OTP</Form.Label>
                      <StyledOtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                      />
                    </Form.Group>
                    <Button variant="link" onClick={handleResendOTP} disabled={isLoading}>
                      Resend OTP
                    </Button>
                  </>
                )}

                <StyledButton type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? <Loader /> : isLogin ? (showOtpInput ? 'Verify OTP' : 'Login') : 'Register'}
                </StyledButton>

                <p className="mt-3 text-center">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <Button variant="link" onClick={toggleLoginRegister}>
                    {isLogin ? 'Register now' : 'Login'}
                  </Button>
                </p>
              </LoginForm>
            </LoginContainer>
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