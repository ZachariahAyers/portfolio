import React, { Component } from 'react';

const LAMBDA_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Sanitize error details - remove sensitive information
    const sanitizedError = {
      message: error.message || 'Unknown error',
      // Only include the error name, not the full stack trace
      type: error.name || 'Error',
      // Only include the component name from the stack, not the full trace
      component: errorInfo.componentStack?.split('\n')[0]?.trim() || 'Unknown component',
      // Basic page info without full URL
      page: window.location.pathname,
      // Basic browser info without full user agent
      browser: navigator.userAgent?.includes('Chrome') ? 'Chrome' : 
               navigator.userAgent?.includes('Firefox') ? 'Firefox' : 
               navigator.userAgent?.includes('Safari') ? 'Safari' : 'Other',
      timestamp: new Date().toISOString()
    };

    const errorDetails = `
Error Type: ${sanitizedError.type}
Message: ${sanitizedError.message}
Component: ${sanitizedError.component}
Page: ${sanitizedError.page}
Browser: ${sanitizedError.browser}
Time: ${sanitizedError.timestamp}
    `.trim();

    // Send error report via Lambda only in production
    if (LAMBDA_ENDPOINT && import.meta.env.MODE === 'production') {
      fetch(`${LAMBDA_ENDPOINT}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Error Reporter',
          email: 'system@zachayers.io',
          message: errorDetails,
          formType: 'Error Report',
          subject: 'Portfolio AI - Production Error'
        })
      }).catch(() => {
        // Error reporting failed - fail silently
      });
    } else if (import.meta.env.MODE === 'development') {
      console.error('Error caught in development:', sanitizedError);
    }

    this.setState({ error: error.toString() });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#1a1a1a',
          color: '#ffffff'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            I've been notified and will look into this issue.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;