import React from 'react';
import { FiRefreshCw, FiHome, FiAlertTriangle } from 'react-icons/fi';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 ErrorBoundary: Error caught!', {
      error: error,
      errorInfo: errorInfo,
      stack: error.stack,
      message: error.message,
      componentStack: errorInfo.componentStack
    });

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Always log in development, and also in production for debugging
    console.error('🚨 ErrorBoundary: Full error details:', error, errorInfo);

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <FiAlertTriangle />
            </div>
            
            <h1>Oops! Something went wrong</h1>
            <p className="error-message">
              We're sorry, but something unexpected happened. Don't worry, 
              our team has been notified and is working on a fix.
            </p>

            <div className="error-actions">
              <button onClick={this.handleRetry} className="btn btn-primary">
                <FiRefreshCw />
                Try Again
              </button>
              <button onClick={this.handleGoHome} className="btn btn-secondary">
                <FiHome />
                Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <div className="error-stack">
                  <h4>Error:</h4>
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  
                  <h4>Component Stack:</h4>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                  
                  <h4>Stack Trace:</h4>
                  <pre>{this.state.error && this.state.error.stack}</pre>
                </div>
              </details>
            )}

            <div className="error-suggestions">
              <h3>What you can try:</h3>
              <ul>
                <li>Refresh the page</li>
                <li>Check your internet connection</li>
                <li>Clear your browser cache</li>
                <li>Try again in a few minutes</li>
              </ul>
            </div>

            <div className="error-contact">
              <p>
                Still having issues? <a href="mailto:support@fitgenius.com">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 