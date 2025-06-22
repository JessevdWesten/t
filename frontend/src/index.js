import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';

console.log('🔧 INDEX: Starting application initialization...');
console.log('🔧 INDEX: All imports successful');

// Create a client
console.log('🔧 INDEX: Creating QueryClient...');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
console.log('🔧 INDEX: QueryClient created successfully');

console.log('🔧 INDEX: Creating React root...');
const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('🔧 INDEX: About to render app...');

try {
  root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <GlobalStyles />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
  console.log('🔧 INDEX: App rendered successfully');
} catch (error) {
  console.error('❌ INDEX: Critical error during app initialization:', error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">
    <h1>Critical Error</h1>
    <p>Failed to initialize application: ${error.message}</p>
    <pre>${error.stack}</pre>
  </div>`;
} 