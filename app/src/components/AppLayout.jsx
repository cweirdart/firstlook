import { Outlet, NavLink, Link } from 'react-router-dom'
import { useState } from 'react'

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    color: isActive ? 'var(--accent-dark)' : 'var(--text-muted)',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-body)',
    fontWeight: isActive ? 500 : 400,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-sm)',
    transition: 'all var(--transition)',
    textDecoration: 'none',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Skip-to-content link — only visible on keyboard focus */}
      <a href="#main-content" className="skip-nav">Skip to main content</a>

      {/* Top Navigation Bar */}
      <nav style={{
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 400,
            letterSpacing: '0.02em',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            marginRight: '48px',
          }}
        >
          First Look
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          flex: 1,
        }}
        className="desktop-nav"
        >
          <NavLink to="/dashboard" end style={navLinkStyle}>Albums</NavLink>
          <NavLink to="/album/new" style={navLinkStyle}>New Album</NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="mobile-menu-button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileMenuOpen ? '\u2715' : '\u2630'}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            display: 'none',
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border)',
            padding: '12px 32px 20px',
            flexDirection: 'column',
            gap: '4px',
          }}
          className="mobile-nav-menu"
          id="mobile-nav-menu"
        >
          <NavLink
            to="/dashboard"
            end
            style={({ isActive }) => ({
              padding: '12px 16px',
              color: isActive ? 'var(--accent-dark)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-body)',
              fontWeight: isActive ? 600 : 400,
              borderRadius: 'var(--radius-sm)',
              display: 'block',
              textDecoration: 'none',
            })}
            onClick={() => setMobileMenuOpen(false)}
          >
            Albums
          </NavLink>
          <NavLink
            to="/album/new"
            style={({ isActive }) => ({
              padding: '12px 16px',
              color: isActive ? 'var(--accent-dark)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-body)',
              fontWeight: isActive ? 600 : 400,
              borderRadius: 'var(--radius-sm)',
              display: 'block',
              textDecoration: 'none',
            })}
            onClick={() => setMobileMenuOpen(false)}
          >
            New Album
          </NavLink>
        </div>
      )}

      {/* Page Content */}
      <main id="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-button { display: block !important; }
          .mobile-nav-menu { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}
