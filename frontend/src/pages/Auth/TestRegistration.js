import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TestRegistration = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTestRegistration = async () => {
    setLoading(true);
    setResult(null);

    const testData = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      full_name: 'Test User'
    };

    console.log('🧪 Testing registration with:', testData);

    try {
      const result = await register(testData);
      console.log('🧪 Registration result:', result);
      setResult(result);
      
      if (result.success) {
        toast.success('Test registration successful! 🎉');
      } else {
        toast.error(`Test registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('🧪 Test registration error:', error);
      setResult({ success: false, error: error.message });
      toast.error(`Test error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAPITest = async () => {
    setLoading(true);
    setResult(null);

    const testData = {
      email: `api-test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      full_name: 'API Test User'
    };

    console.log('🧪 Testing direct API call with:', testData);

    try {
      const response = await fetch('https://fitnesstracker-backend-docker.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      console.log('🧪 Direct API response:', data);
      console.log('🧪 Response status:', response.status);

      setResult({
        success: response.ok,
        status: response.status,
        data: data
      });

      if (response.ok) {
        toast.success('Direct API test successful! 🎉');
      } else {
        toast.error(`Direct API test failed: ${data.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('🧪 Direct API test error:', error);
      setResult({ success: false, error: error.message });
      toast.error(`Direct API error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🧪 Registration Testing</h1>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '2rem', 
          borderRadius: '1rem',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2>Test Registration Flow</h2>
          <p>This will test the registration using the AuthContext:</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={handleTestRegistration}
              disabled={loading}
              style={{ 
                background: 'rgba(16, 185, 129, 0.8)', 
                color: 'white', 
                padding: '1rem 2rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Testing...' : 'Test AuthContext Registration'}
            </button>

            <button 
              onClick={handleDirectAPITest}
              disabled={loading}
              style={{ 
                background: 'rgba(59, 130, 246, 0.8)', 
                color: 'white', 
                padding: '1rem 2rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Testing...' : 'Test Direct API Call'}
            </button>
          </div>

          {result && (
            <div style={{ 
              background: result.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: `1px solid ${result.success ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
            }}>
              <h3>{result.success ? '✅ Success' : '❌ Failed'}</h3>
              <pre style={{ 
                background: 'rgba(0,0,0,0.2)',
                padding: '1rem',
                borderRadius: '0.25rem',
                overflow: 'auto',
                fontSize: '0.9rem'
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '1.5rem', 
          borderRadius: '1rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h3>Backend Information</h3>
          <p><strong>Backend URL:</strong> https://fitnesstracker-backend-docker.onrender.com</p>
          <p><strong>Registration Endpoint:</strong> /api/auth/register</p>
          <p><strong>Expected Data:</strong> {`{ email, password, full_name }`}</p>
          
          <div style={{ marginTop: '1rem' }}>
            <h4>Debugging Steps:</h4>
            <ol style={{ paddingLeft: '1.5rem' }}>
              <li>Open browser DevTools (F12)</li>
              <li>Go to Console tab</li>
              <li>Click "Test AuthContext Registration" or "Test Direct API Call"</li>
              <li>Check console logs for detailed debugging information</li>
              <li>Check Network tab for HTTP requests and responses</li>
            </ol>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => window.location.hash = '#register'}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              padding: '1rem 2rem', 
              border: 'none', 
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Registration Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestRegistration;
