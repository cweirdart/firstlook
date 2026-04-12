import { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * React Error Boundary — catches JavaScript errors in the component tree
 * and shows a friendly fallback UI instead of a white screen.
 *
 * Wrap the top-level <Routes> with this in App.jsx.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#FBF9F6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '48px',
            fontWeight: 300,
            color: '#D4C8BA',
            marginBottom: '8px',
          }}>
            Oops
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '24px',
            fontWeight: 400,
            color: '#3D3530',
            marginBottom: '12px',
          }}>
            Something went wrong
          </h1>
          <p style={{
            color: '#6B5E56',
            fontSize: '14px',
            maxWidth: '380px',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            Don't worry — your photos are safe. Try refreshing the page. If the problem persists, contact us at hello@firstlook.love.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              style={{
                padding: '12px 24px',
                background: '#B8976A',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Refresh Page
            </button>
            <a
              href="/"
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#3D3530',
                border: '1px solid #D4C8BA',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                fontFamily: 'inherit',
              }}
            >
              Go Home
            </a>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{
              marginTop: '32px',
              padding: '16px',
              background: '#F5F0EA',
              border: '1px solid #D4C8BA',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#6B5E56',
              maxWidth: '600px',
              overflow: 'auto',
              textAlign: 'left',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
