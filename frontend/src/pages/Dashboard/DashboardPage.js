import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: var(--space-6);
`;

const Title = styled.h1`
  color: var(--secondary-900);
  margin-bottom: var(--space-6);
`;

const Card = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
`;

const DashboardPage = () => {
  return (
    <Container>
      <Title>Dashboard</Title>
      <Card>
        <h2>Welcome to Smart Fitness & Nutrition Coach!</h2>
        <p>This is the Phase 1 MVP of your fitness and nutrition planning application.</p>
        <p>Features being built:</p>
        <ul>
          <li>✅ User authentication system</li>
          <li>✅ Modern React frontend with styled-components</li>
          <li>✅ FastAPI backend with SQLAlchemy</li>
          <li>✅ PostgreSQL database with comprehensive models</li>
          <li>✅ Rule-based plan generation engine</li>
          <li>🚧 User onboarding questionnaire</li>
          <li>🚧 Exercise and recipe databases</li>
          <li>🚧 Personalized plan generation</li>
          <li>📅 Future: ML-powered recommendations (Phase 2)</li>
          <li>📅 Future: Reinforcement learning adaptation (Phase 3)</li>
        </ul>
      </Card>
    </Container>
  );
};

export default DashboardPage; 