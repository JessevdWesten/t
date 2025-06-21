import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from './Navigation';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--secondary-50);
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: white;
  border-right: 1px solid var(--secondary-200);
  box-shadow: var(--shadow-sm);

  @media (max-width: 768px) {
    width: 100%;
    position: fixed;
    top: 0;
    left: ${props => props.isOpen ? '0' : '-100%'};
    z-index: 1000;
    transition: left 0.3s ease;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: var(--space-6);
  
  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`;

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen}>
        <Navigation onClose={() => setSidebarOpen(false)} />
      </Sidebar>
      
      <MainContent>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 