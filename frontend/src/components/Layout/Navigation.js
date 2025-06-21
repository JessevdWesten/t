import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  User, 
  Dumbbell, 
  ChefHat, 
  Calendar, 
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NavContainer = styled.nav`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--secondary-200);
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoText = styled.h1`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--secondary-900);
  margin: 0;
`;

const NavItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
`;

const NavItem = styled.li`
  margin-bottom: var(--space-2);
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--secondary-600);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary-50);
    color: var(--primary-700);
  }
  
  ${props => props.active && `
    background-color: var(--primary-100);
    color: var(--primary-700);
  `}
`;

const UserInfo = styled.div`
  padding: var(--space-4);
  border-top: 1px solid var(--secondary-200);
  margin-top: auto;
`;

const UserName = styled.p`
  font-weight: var(--font-weight-medium);
  color: var(--secondary-900);
  margin: 0 0 var(--space-2) 0;
  font-size: var(--font-size-sm);
`;

const UserEmail = styled.p`
  color: var(--secondary-500);
  font-size: var(--font-size-xs);
  margin: 0 0 var(--space-4) 0;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: none;
  border: none;
  color: var(--secondary-600);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: var(--space-2) 0;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--error-600);
  }
`;

const Navigation = ({ onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/plans', label: 'My Plans', icon: Calendar },
    { path: '/exercises', label: 'Exercises', icon: Dumbbell },
    { path: '/recipes', label: 'Recipes', icon: ChefHat },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  return (
    <NavContainer>
      <Logo>
        <LogoIcon>
          <Activity size={24} />
        </LogoIcon>
        <LogoText>FitCoach</LogoText>
      </Logo>

      <NavItems>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavItem key={path}>
            <NavLink 
              to={path} 
              active={location.pathname === path ? 1 : 0}
              onClick={onClose}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          </NavItem>
        ))}
      </NavItems>

      <UserInfo>
        {user && (
          <>
            <UserName>{user.first_name || 'User'}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </>
        )}
        <LogoutButton onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </LogoutButton>
      </UserInfo>
    </NavContainer>
  );
};

export default Navigation; 