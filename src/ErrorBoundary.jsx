import React, { Component } from 'react';

const LAMBDA_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorDetails = `
Error: ${error.toString()}
Stack: ${error.stack}
Component Stack: ${errorInfo.componentStack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Time: ${new Date().toISOString()}
    `.trim();

    // Send error report via Lambda
    if (LAMBDA_ENDPOINT) {
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
        // Error reporting failed - log to console as fallback
        console.error('Failed to report error:', errorDetails);
      });
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