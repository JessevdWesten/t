import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: var(--space-6);
`;

const Title = styled.h1`
  color: var(--secondary-900);
  margin-bottom: var(--space-6);
`;

const ProfilePage = () => {
  return (
    <Container>
      <Title>Profile</Title>
      <p>Profile management coming soon...</p>
    </Container>
  );
};

export default ProfilePage; 