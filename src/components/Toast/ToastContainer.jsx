import React from 'react';
import { ToastContainer as ToastifyContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimesCircle 
} from 'react-icons/fa';

const StyledToastContainer = styled(ToastifyContainer)`
  .Toastify__toast {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 15px;
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    border-left: 4px solid transparent;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
  }

  .Toastify__toast--success {
    border-left-color: #ffcc00;
    
    .Toastify__toast-icon {
      color: #ffcc00;
    }
  }

  .Toastify__toast--error {
    border-left-color: #d32f2f;
    
    .Toastify__toast-icon {
      color: #d32f2f;
    }
  }

  .Toastify__toast--warning {
    border-left-color: #ff9800;
    
    .Toastify__toast-icon {
      color: #ff9800;
    }
  }

  .Toastify__toast--info {
    border-left-color: #2196f3;
    
    .Toastify__toast-icon {
      color: #2196f3;
    }
  }

  .Toastify__toast-body {
    color: #333;
    margin-left: 10px;
    font-size: 14px;
  }

  .Toastify__close-button {
    color: #999;
    opacity: 0.7;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

const ToastContainer = () => {
  return (
    <StyledToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={true}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      toastClassName="custom-toast"
      progressClassName="custom-progress"
      icon={({ type }) => {
        switch(type) {
          case 'success': return <FaCheckCircle size={24} />;
          case 'error': return <FaTimesCircle size={24} />;
          case 'warning': return <FaExclamationTriangle size={24} />;
          case 'info': return <FaInfoCircle size={24} />;
          default: return null;
        }
      }}
    />
  );
};

export default ToastContainer;

const customToast = {
  success: (message) => toast.success(message, {
    className: 'toast-success',
    progressClassName: 'toast-progress-success'
  }),
  error: (message) => toast.error(message, {
    className: 'toast-error',
    progressClassName: 'toast-progress-error'
  }),
  warning: (message) => toast.warning(message, {
    className: 'toast-warning',
    progressClassName: 'toast-progress-warning'
  }),
  info: (message) => toast.info(message, {
    className: 'toast-info',
    progressClassName: 'toast-progress-info'
  })
};

export { customToast };