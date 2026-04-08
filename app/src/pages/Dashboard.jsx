import { Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { albums, loading } = useAppState()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (loading) {
    return (
      <div className="page">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          minHeight: '400px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading your albums...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ animation: mounted ? 'fadeIn 0.3s ease' : 'none' }}>
      {/* Page Header */}
      <div className="page-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
      }}>
        <div>
          <h1 className="page-title" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            Your Albums
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}>
            Manage and share your wedding albums
          </p>
        </div>
        <Link
          to="/album/new"
          className="btn btn-primary"
          style={{
            whiteSpace: 'nowrap',
            marginLeft: '16px',
          }}
        >
          + New Album
        </Link>
      </div>

      {/* Albums Grid */}
      {albums && albums.length > 0 ? (
        <div className="grid grid-cols-3" style={{
          '@media (max-width: 1024px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
        }}>
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '24px',
                  transition: 'all 0.2s ease-out',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFFFFF'
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* Album Title */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  wordBreak: 'break-word',
                }}>
                  {album.name}
                </h3>

                {/* Album Description (if available) */}
                {album.description && (
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {album.description}
                  </p>
                )}

                {/* Metadata Row */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}>
                  {/* Photo Count Badge */}
                  <div className="badge badge-accent" style={{
                    backgroundColor: 'var(--accent)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    {album.photoCount || 0} photo{album.photoCount !== 1 ? 's' : ''}
                  </div>

                  {/* Share Code Badge */}
                  {album.shareCode && (
                    <div className="badge badge-rose" style={{
                      backgroundColor: 'var(--accent-rose)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      {album.shareCode.slice(0, 4).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Date Created */}
                {album.createdAt && (
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '12px',
                    marginBottom: 0,
                  }}>
                    Created {new Date(album.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: new Date(album.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-state" style={{
          textAlign: 'center',
          paddingTop: '60px',
          paddingBottom: '60px',
        }}>
          <svg
            className="empty-state-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 24px',
              display: 'block',
            }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            No albums yet
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '32px',
            maxWidth: '400px',
            margin: '0 auto 32px',
            lineHeight: 1.5,
          }}>
            Create your first wedding album to start sharing and organizing your favorite moments with loved ones.
          </p>

          <Link to="/album/new" className="btn btn-primary">
            Create Your First Album
          </Link>
        </div>
      )}

      {/* Responsive Grid Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .grid-cols-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .page-header .btn {
            width: 100%;
          }

          .grid-cols-3,
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
