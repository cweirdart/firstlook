import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FBF9F6',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: '#3D3530',
          padding: '24px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.8rem',
            fontWeight: 400,
            marginBottom: '12px',
          }}>
            Something went wrong
          </h1>
          <p style={{
            color: '#6B5E56',
            fontSize: '0.95rem',
            maxWidth: '400px',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            Don't worry — your photos are safe. Try refreshing the page,
            or head back to the home page.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: '#B8976A',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
            <a
              href="/"
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: '#6B5E56',
                border: '1.5px solid #D4C8BA',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go Home
            </a>
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: '#9C8F87',
            fontSize: '0.9rem',
            marginTop: '48px',
          }}>
            First Look
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
