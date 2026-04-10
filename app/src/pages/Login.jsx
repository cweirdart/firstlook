import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signInWithMagicLink } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [mode, setMode] = useState('password') // 'password' | 'magic'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'magic') {
        await signInWithMagicLink(email)
        setMagicLinkSent(true)
      } else {
        await signIn({ email, password })
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x2709;&#xFE0F;</div>
            <h2 style={headingStyle}>Check Your Email</h2>
            <p style={subStyle}>
              We sent a login link to <strong>{email}</strong>. Click it to sign in — no password needed.
            </p>
            <button
              onClick={() => { setMagicLinkSent(false); setMode('password') }}
              style={{ ...linkBtnStyle, marginTop: '24px' }}
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '32px',
          fontWeight: 300,
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          Welcome Back
        </h1>
        <p style={{ ...subStyle, textAlign: 'center', marginBottom: '32px' }}>
          Sign in to your First Look account
        </p>

        {error && (
          <div style={errorStyle}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          {mode === 'password' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
                style={inputStyle}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing in...' : mode === 'magic' ? 'Send Login Link' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setMode(mode === 'password' ? 'magic' : 'password')}
            style={linkBtnStyle}
          >
            {mode === 'password' ? 'Use magic link instead' : 'Use password instead'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-dark)', fontWeight: 500, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Shared Styles ──────────────────────────────────────────

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  backgroundColor: 'var(--bg-primary)',
}

const cardStyle = {
  width: '100%',
  maxWidth: '420px',
  padding: '40px 32px',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  boxShadow: '0 4px 24px rgba(61, 53, 48, 0.06)',
}

const headingStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--text-primary)',
  marginBottom: '8px',
}

const subStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--text-muted)',
  lineHeight: 1.5,
}

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  padding: '14px 14px',
  border: '1.5px solid #C4B5A5',
  borderRadius: '6px',
  fontFamily: 'var(--font-body)',
  fontSize: '16px',
  color: 'var(--text-primary)',
  backgroundColor: 'var(--bg-primary)',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
}

const errorStyle = {
  padding: '10px 14px',
  borderRadius: '6px',
  backgroundColor: 'rgba(239, 68, 68, 0.08)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: '#DC2626',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  marginBottom: '16px',
}

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--accent-dark)',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  cursor: 'pointer',
  textDecoration: 'underline',
}
