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

const StyledOTP = styled(OtpInput)`
 gap: 0.5rem;
 justify-content: center;
 margin: 1.5rem 0;

 input {
   width: 3rem !important;
   height: 3rem !important;
   font-size: 1.5rem;
   border-radius: 10px;
   border: 1px solid ${props => props.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
   background: ${props => props.isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff'};
   color: ${props => props.isDarkMode ? '#fff' : '#333'};

   &:focus {
     border-color: #0a6638;
     outline: none;
     box-shadow: 0 0 0 0.2rem rgba(10,102,56,0.25);
   }
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
 const [phoneNumber, setPhoneNumber] = useState('');
 const [otp, setOtp] = useState('');
 const [showOtpInput, setShowOtpInput] = useState(false);
 const [error, setError] = useState('');
 const [name, setName] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 const validateEmail = (email) => {
   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return re.test(email);
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   setError('');
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
       if (!name || !email || !password ) {
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

 return (
   <StyledModal show={show} onHide={handleClose} size="lg" centered isDarkMode={isDarkMode}>
     <Modal.Header closeButton>
       <Modal.Title>{isLogin ? 'Welcome Back' : 'Create Account'}</Modal.Title>
     </Modal.Header>
     <Modal.Body>
       <Row>
         {/* <Col md={6} className="d-none d-md-block">
           <ImageSection />
         </Col> */}
         <Col md={12}>
           <ModalContainer>
             <AuthForm onSubmit={handleSubmit}>
               {error && <Alert variant="danger">{error}</Alert>}

               {!showOtpInput && (
                 <>
                   <SocialLoginButton isDarkMode={isDarkMode} onClick={() => {}}>
                     <FaGoogle /> Continue with Google
                   </SocialLoginButton>

                   <Divider isDarkMode={isDarkMode}>
                     <span>or</span>
                   </Divider>

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
                     <Form.Group className="text-center">
                       <h5>Enter verification code</h5>
                       <p className="text-muted">We've sent a code to {phoneNumber}</p>
                       <StyledOTP
                         value={otp}
                         onChange={setOtp}
                         numInputs={6}
                         isDarkMode={isDarkMode}
                         renderSeparator={<span>-</span>}
                         renderInput={(props) => <input {...props} />}
                       />
                       <Button variant="link" onClick={handleResendOTP} disabled={isLoading}>
                         Resend code
                       </Button>
                     </Form.Group>
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

{(loginMethod === 'email' || !isLogin) && (
   <Form.Group className="mb-3">
     <Form.Label>Confirm Password</Form.Label>
     <StyledInput
       type="password"
       placeholder="Enter your password" 
       value={password}
       onChange={(e) => setPassword(e.target.value)}
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
     onClick={() => {
       setIsLogin(!isLogin);
       setError('');
       setShowOtpInput(false);
     }}
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