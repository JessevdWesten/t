import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${props => props.fullScreen ? '100vh' : '200px'};
  width: 100%;
`;

const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 4px solid var(--secondary-200);
  border-top: 4px solid var(--primary-500);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: var(--space-4);
  color: var(--secondary-600);
  font-size: var(--font-size-sm);
  text-align: center;
`;

const LoadingSpinner = ({ 
  size = '40px', 
  fullScreen = false, 
  text = '', 
  className = '' 
}) => {
  return (
    <SpinnerContainer fullScreen={fullScreen} className={className}>
      <div>
        <Spinner size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 