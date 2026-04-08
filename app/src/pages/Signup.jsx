import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signUp({ email, password, displayName: name })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: 'var(--bg-primary)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(61, 53, 48, 0.06)',
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '32px',
          fontWeight: 300,
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          Create Your Album
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          Start collecting your wedding memories in one beautiful place
        </p>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '6px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#DC2626',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah"
              required
              style={inputStyle}
            />
          </div>

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

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Creating account...' : 'Get Started'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-dark)', fontWeight: 500, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
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
  padding: '12px 14px',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--text-primary)',
  backgroundColor: 'var(--bg-primary)',
  boxSizing: 'border-box',
}
