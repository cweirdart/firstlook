import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as storage from '../services/storage'
import { hashPassword } from '../utils/crypto'

async function findAlbumByShareCode(code) {
  const albums = await storage.getAlbums()
  return albums.find(a => a.shareCode === code) || null
}

function downloadPhoto(photo) {
  const link = document.createElement('a')
  link.href = photo.dataUrl
  link.download = photo.filename || 'wedding-photo.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function SharedAlbum() {
  const { shareCode } = useParams()
  const navigate = useNavigate()

  const [album, setAlbum] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const [verifyingPassword, setVerifyingPassword] = useState(false)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Load album and photos on mount
  useEffect(() => {
    const loadAlbum = async () => {
      setLoading(true)
      setError(null)

      if (!shareCode) {
        setError('Invalid album link')
        setLoading(false)
        return
      }

      try {
        const foundAlbum = await findAlbumByShareCode(shareCode)
        if (!foundAlbum) {
          setError('Album not found')
          setLoading(false)
          return
        }

        if (foundAlbum.passwordHash) {
          setPasswordRequired(true)
          setAlbum(foundAlbum)
        } else {
          setAlbum(foundAlbum)
          await loadPhotos(foundAlbum.id)
        }
      } catch (err) {
        setError('Failed to load album')
      } finally {
        setLoading(false)
      }
    }

    loadAlbum()
  }, [shareCode])

  const loadPhotos = async (albumId) => {
    try {
      const albumPhotos = await storage.getPhotosByAlbum(albumId)
      // Only show approved photos (hide pending and rejected)
      const visiblePhotos = albumPhotos.filter(p => p.status !== 'pending' && p.status !== 'rejected')
      setPhotos(visiblePhotos)
    } catch (err) {
      console.error('Failed to load photos:', err)
    }
  }

  // Verify password
  const handleVerifyPassword = async (e) => {
    e.preventDefault()
    setVerifyingPassword(true)
    setPasswordError(null)

    try {
      const hash = await hashPassword(passwordInput)
      if (hash === album.passwordHash) {
        setPasswordRequired(false)
        setPasswordInput('')
        await loadPhotos(album.id)
      } else {
        setPasswordError('Incorrect password')
      }
    } catch (err) {
      setPasswordError('Error verifying password')
    } finally {
      setVerifyingPassword(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="page" style={{ minHeight: '100vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: '16px',
          }}
        >
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading album...</p>
        </div>
      </div>
    )
  }

  // Error state - album not found
  if (error) {
    return (
      <div className="page" style={{ minHeight: '100vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <svg
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                opacity: 0.3,
                color: 'var(--text-muted)',
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              {error}
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
                marginBottom: '24px',
              }}
            >
              The album link may have expired or is invalid. Please check and try again.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  // Password prompt state
  if (passwordRequired) {
    return (
      <div className="page" style={{ minHeight: '100vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 24px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              {album.name}
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '13px',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              This album is password protected
            </p>

            <form onSubmit={handleVerifyPassword}>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    setPasswordError(null)
                  }}
                  placeholder="Enter password"
                  disabled={verifyingPassword}
                  autoFocus
                />
                {passwordError && (
                  <p style={{ color: '#B44A4A', fontSize: '12px', marginTop: '6px' }}>
                    {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={verifyingPassword || !passwordInput.trim()}
              >
                {verifyingPassword ? 'Verifying...' : 'Unlock'}
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  // Main gallery view
  return (
    <div className="page" style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 8vw, 48px)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {album.name}
          </h1>
          {photos.length > 0 && (
            <span
              style={{
                background: 'var(--bg-blush)',
                color: 'var(--accent-dark)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {photos.length} photo{photos.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {album.description && (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '16px',
              margin: 0,
              lineHeight: 1.6,
              maxWidth: '600px',
            }}
          >
            {album.description}
          </p>
        )}
      </div>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 100vw, 300px), 1fr))',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => {
                  setLightboxIndex(idx)
                  setLightboxOpen(true)
                }}
                style={{
                  aspectRatio: '1',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(61, 53, 48, 0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(61, 53, 48, 0.16)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(61, 53, 48, 0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <img
                  src={photo.thumbnailUrl || photo.dataUrl}
                  alt={photo.filename}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {lightboxOpen && (
            <Lightbox
              photos={photos}
              index={lightboxIndex}
              onClose={() => setLightboxOpen(false)}
              onNext={() => setLightboxIndex((i) => (i + 1) % photos.length)}
              onPrev={() => setLightboxIndex((i) => (i - 1 + photos.length) % photos.length)}
            />
          )}
        </>
      ) : (
        /* Empty State */
        <div className="empty-state">
          <svg
            className="empty-state-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>

          <h2
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            No photos yet
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              marginBottom: '24px',
              maxWidth: '400px',
            }}
          >
            Be the first to share photos from this wedding. Upload your favorite moments now!
          </p>

          <a
            href={`/upload/${shareCode}`}
            className="btn btn-primary"
          >
            Upload Photos
          </a>
        </div>
      )}

      {/* Upload CTA Card */}
      {photos.length > 0 && (
        <div
          style={{
            marginBottom: '24px',
            padding: '40px 28px',
            background: `linear-gradient(135deg, var(--bg-blush) 0%, var(--bg-primary) 100%)`,
            border: '1px solid var(--border)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              color: 'var(--text-primary)',
              margin: '0 0 12px 0',
              fontWeight: 500,
            }}
          >
            Share Your Moments
          </p>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              margin: '0 0 20px 0',
              lineHeight: 1.5,
            }}
          >
            Have photos from the wedding? Add them to the album!
          </p>
          <a
            href={`/upload/${shareCode}`}
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              background: 'var(--accent)',
              color: '#FBF9F6',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
              minHeight: '44px',
              lineHeight: '24px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-dark)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Upload Your Photos
          </a>
        </div>
      )}

      <Footer />
    </div>
  )
}

function Lightbox({ photos, index, onClose, onNext, onPrev }) {
  const [touchStart, setTouchStart] = useState(null)
  const photo = photos[index]

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    if (!touchStart) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) onNext()
      else onPrev()
    }
    setTouchStart(null)
  }

  return (
    <div
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'clamp(12px, 5%, 24px)',
          right: 'clamp(12px, 5%, 24px)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          color: 'white',
          width: '44px',
          height: '44px',
          minWidth: '44px',
          minHeight: '44px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          zIndex: 1001,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Main Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '90vw',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
      >
        <img
          src={photo.dataUrl}
          alt={photo.filename}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            animation: 'fadeIn 0.3s ease',
          }}
        />

        {/* Navigation Arrows - Desktop Only */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              style={{
                position: 'absolute',
                left: 'clamp(12px, 5%, 24px)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 1001,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
              aria-label="Previous photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              style={{
                position: 'absolute',
                right: 'clamp(12px, 5%, 24px)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 1001,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
              aria-label="Next photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Download Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            downloadPhoto(photo)
          }}
          style={{
            position: 'absolute',
            top: 'clamp(12px, 5%, 24px)',
            left: 'clamp(12px, 5%, 24px)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            width: '44px',
            height: '44px',
            minWidth: '44px',
            minHeight: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 1001,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
          }}
          aria-label="Download photo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        {/* Counter */}
        {photos.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              zIndex: 1001,
              backdropFilter: 'blur(4px)',
            }}
          >
            {index + 1} of {photos.length}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function Footer() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        background: 'rgba(251, 249, 246, 0.98)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--text-muted)',
          letterSpacing: '0.5px',
        }}
      >
        First Look
      </p>
    </div>
  )
}
