// NotFound.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';

const Container = styled.div`
 width: 100%;
 min-height: 100vh;
 overflow: hidden;
 text-align: center;
 background: linear-gradient(135deg, #0a6638 0%, #084a29 100%);
 display: flex;
 justify-content: center;
 align-items: center;
 position: relative;
`;

const ErrorContent = styled.div`
 width: 90%;
 max-width: 600px;
 padding: 2rem;
 position: relative;
 z-index: 2;

 h1 {
   font-size: clamp(100px, 15vw, 180px);
   color: #fff;
   margin: 0;
   opacity: 0;
   transform: translateY(-50px);
   transition: all 0.5s ease;
   position: relative;
   line-height: 1;
   text-shadow: 2px 2px 0px #084a29;
 }

 p {
   font-size: clamp(18px, 3vw, 24px);
   color: #fffacc;
   margin: 1rem 0;
   letter-spacing: 2px;
   opacity: 0;
   transform: translateY(50px);
   transition: all 0.5s ease;
   transition-delay: 0.2s;
 }

 button {
   background: #fffacc;
   color: #0a6638;
   border: none;
   padding: 1rem 2rem;
   font-size: 1.1rem;
   border-radius: 50px;
   cursor: pointer;
   opacity: 0;
   transform: scale(0.9);
   transition: all 0.3s ease;
   transition-delay: 0.4s;
   margin-top: 2rem;
   display: inline-flex;
   align-items: center;
   gap: 0.5rem;
   box-shadow: 0 4px 15px rgba(0,0,0,0.2);

   &:hover {
     background: #fff;
     transform: scale(1.05) translateY(-2px);
     box-shadow: 0 6px 20px rgba(0,0,0,0.25);
   }

   svg {
     font-size: 1.2rem;
   }
 }

 &.active {
   h1 {
     opacity: 1;
     transform: translateY(0);
   }
   p {
     opacity: 1;
     transform: translateY(0);
   }
   button {
     opacity: 1;
     transform: scale(1);
   }
 }
`;

const BackgroundAnimation = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 overflow: hidden;
 z-index: 1;

 &::before,
 &::after {
   content: '';
   position: absolute;
   width: 150vmax;
   height: 150vmax;
   border-radius: 50%;
   background: rgba(8, 74, 41, 0.4);
   animation: drift linear infinite;
   transform-origin: 50% 50%;
 }

 &::before {
   animation-duration: 15s;
   left: -50%;
   top: -50%;
 }

 &::after {
   animation-duration: 17s;
   animation-direction: reverse;
   right: -50%;
   bottom: -50%;
 }

 @keyframes drift {
   from {
     transform: rotate(0deg);
   }
   to {
     transform: rotate(360deg);
   }
 }
`;

const PawPrints = styled.div`
 position: absolute;
 width: 100%;
 height: 100%;
 opacity: 0.1;
 background-image: radial-gradient(circle, #fff 2px, transparent 2px);
 background-size: 50px 50px;
`;

const NotFound = () => {
 const navigate = useNavigate();

 useEffect(() => {
   const timer = setTimeout(() => {
     document.querySelector('.error-content').classList.add('active');
   }, 100);
   return () => clearTimeout(timer);
 }, []);

 return (
   <Container>
     <BackgroundAnimation />
     <PawPrints />
     <ErrorContent className="error-content">
       <h1>404</h1>
       <p>Oops! Looks like this page has gone for a walk.</p>
       <button onClick={() => navigate('/')}>
         <FaPaw /> Back to Home
       </button>
     </ErrorContent>
   </Container>
 );
};

export default NotFound;