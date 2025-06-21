import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
  padding: var(--space-4);
`;

const LoginCard = styled.div`
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-8);
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoText = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--secondary-900);
  margin: 0;
`;

const Title = styled.h2`
  text-align: center;
  margin: 0 0 var(--space-2) 0;
  color: var(--secondary-900);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
`;

const Subtitle = styled.p`
  text-align: center;
  margin: 0 0 var(--space-8) 0;
  color: var(--secondary-600);
  font-size: var(--font-size-sm);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const Label = styled.label`
  font-weight: var(--font-weight-medium);
  color: var(--secondary-700);
  font-size: var(--font-size-sm);
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  padding-left: var(--space-10);
  border: 1px solid var(--secondary-300);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  
  &::placeholder {
    color: var(--secondary-400);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--secondary-400);
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--secondary-400);
  cursor: pointer;
  padding: var(--space-1);
  
  &:hover {
    color: var(--secondary-600);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--error-50);
  color: var(--error-700);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--error-200);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-4);
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: var(--space-6);
  color: var(--secondary-600);
  font-size: var(--font-size-sm);
  
  a {
    color: var(--primary-600);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({
      username: formData.email,
      password: formData.password,
    });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <LogoIcon>
            <Activity size={28} />
          </LogoIcon>
          <LogoText>FitCoach</LogoText>
        </Logo>

        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account to continue</Subtitle>

        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <InputContainer>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputContainer>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputContainer>
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="20px" /> : 'Sign In'}
          </Button>
        </Form>

        <SignupLink>
          Don't have an account? <Link to="/register">Sign up</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage; 