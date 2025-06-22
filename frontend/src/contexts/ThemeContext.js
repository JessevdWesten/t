import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  console.log('🔧 ThemeProvider: Component initializing...');
  const [theme, setTheme] = useState('dark'); // Default to dark theme
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [animations, setAnimations] = useState(true);

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      console.log('🔧 ThemeProvider: Loading saved preferences...');
      const savedTheme = localStorage.getItem('theme');
      const savedSidebarState = localStorage.getItem('sidebarCollapsed');
      const savedAnimations = localStorage.getItem('animations');

      console.log('🔧 ThemeProvider: Found saved preferences:', {
        theme: savedTheme,
        sidebar: savedSidebarState,
        animations: savedAnimations
      });

      if (savedTheme) {
        setTheme(savedTheme);
      }
      if (savedSidebarState !== null) {
        setSidebarCollapsed(JSON.parse(savedSidebarState));
      }
      if (savedAnimations !== null) {
        setAnimations(JSON.parse(savedAnimations));
      }
      console.log('🔧 ThemeProvider: Preferences loaded successfully');
    } catch (error) {
      console.error('❌ ThemeProvider: Error loading preferences:', error);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const toggleAnimations = () => {
    const newState = !animations;
    setAnimations(newState);
    localStorage.setItem('animations', JSON.stringify(newState));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    animations,
    setAnimations,
    toggleAnimations,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 