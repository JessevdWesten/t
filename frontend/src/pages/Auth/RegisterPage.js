import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
  padding: var(--space-4);
`;

const Card = styled.div`
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-8);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const RegisterPage = () => {
  return (
    <Container>
      <Card>
        <h1>Register Page</h1>
        <p>Registration form coming soon...</p>
        <Link to="/login">Back to Login</Link>
      </Card>
    </Container>
  );
};

export default RegisterPage; 