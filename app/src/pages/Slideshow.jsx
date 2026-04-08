import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as storage from '../services/storage'

const INTERVALS = [
  { label: '3s', value: 3000 },
  { label: '5s', value: 5000 },
  { label: '8s', value: 8000 },
  { label: '12s', value: 12000 },
]

const TRANSITIONS = [
  { label: 'Fade', value: 'fade' },
  { label: 'Slide', value: 'slide' },
  { label: 'Zoom', value: 'zoom' },
]

export default function Slideshow() {
  const { id } = useParams()
  const [album, setAlbum] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [interval, setInterval_] = useState(5000)
  const [transition, setTransition] = useState('fade')
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNewBadge, setShowNewBadge] = useState(false)
  const containerRef = useRef(null)
  const timerRef = useRef(null)
  const controlsTimerRef = useRef(null)
  const previousPhotoCount = useRef(0)

  // Load album and photos
  useEffect(() => {
    async function load() {
      try {
        const a = await storage.getAlbum(id)
        if (a) {
          setAlbum(a)
          const p = await storage.getPhotosByAlbum(id)
          // Only show approved photos (or all if moderation not enabled)
          const visible = p.filter(photo => photo.status !== 'rejected' && photo.status !== 'pending')
          setPhotos(visible.length > 0 ? visible : p.filter(photo => photo.status !== 'rejected'))
          previousPhotoCount.current = visible.length || p.length
        }
      } catch (err) {
        console.error('Failed to load slideshow:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Poll for new photos every 10 seconds
  useEffect(() => {
    const pollInterval = window.setInterval(async () => {
      try {
        const p = await storage.getPhotosByAlbum(id)
        const visible = p.filter(photo => photo.status !== 'rejected' && photo.status !== 'pending')
        const newPhotos = visible.length > 0 ? visible : p.filter(photo => photo.status !== 'rejected')
        if (newPhotos.length > previousPhotoCount.current) {
          setPhotos(newPhotos)
          setShowNewBadge(true)
          setTimeout(() => setShowNewBadge(false), 3000)
          previousPhotoCount.current = newPhotos.length
        }
      } catch (err) {
        // Silently fail
      }
    }, 10000)
    return () => window.clearInterval(pollInterval)
  }, [id])

  // Auto-advance
  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      timerRef.current = window.setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % photos.length)
      }, interval)
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [isPlaying, photos.length, interval])

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true)
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 4000)
  }, [isPlaying])

  useEffect(() => {
    resetControlsTimer()
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    }
  }, [resetControlsTimer])

  // Keyboard controls
  useEffect(() => {
    function handleKey(e) {
      resetControlsTimer()
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          setCurrentIndex(prev => (prev + 1) % photos.length)
          break
        case 'ArrowLeft':
          e.preventDefault()
          setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length)
          break
        case 'p':
          setIsPlaying(prev => !prev)
          break
        case 'f':
          toggleFullscreen()
          break
        case 'Escape':
          if (isFullscreen) toggleFullscreen()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [photos.length, isFullscreen, resetControlsTimer])

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    function onFSChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFSChange)
    return () => document.removeEventListener('fullscreenchange', onFSChange)
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>Loading slideshow...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!album || photos.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {album ? 'No Photos Yet' : 'Album Not Found'}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {album ? 'Photos will appear here as guests upload them. The slideshow refreshes automatically.' : 'This album could not be found.'}
          </p>
          <Link to={album ? `/album/${id}` : '/'} className="btn btn-primary" style={{ display: 'inline-block' }}>
            {album ? 'Back to Album' : 'Go Home'}
          </Link>
        </div>
      </div>
    )
  }

  const photo = photos[currentIndex]
  const getTransitionStyle = () => {
    switch (transition) {
      case 'slide':
        return { animation: 'slideIn 0.8s ease-out' }
      case 'zoom':
        return { animation: 'zoomIn 1s ease-out' }
      default:
        return { animation: 'fadeIn 1s ease-in-out' }
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        cursor: showControls ? 'default' : 'none',
      }}
    >
      {/* Photo Display */}
      <div
        key={photo.id}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...getTransitionStyle(),
        }}
      >
        <img
          src={photo.dataUrl}
          alt=""
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* New Photo Badge */}
      {showNewBadge && (
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'var(--accent)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 500,
          animation: 'fadeInDown 0.5s ease-out',
          zIndex: 20,
        }}>
          New photos added!
        </div>
      )}

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        pointerEvents: 'none',
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }} />

      {/* Controls Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.5s ease',
        zIndex: 10,
      }}>
        {/* Left: Album Info */}
        <div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            color: 'white',
            margin: 0,
            fontWeight: 400,
            opacity: 0.9,
          }}>
            {album.name}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            margin: '4px 0 0',
          }}>
            {currentIndex + 1} of {photos.length}
          </p>
        </div>

        {/* Center: Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Prev */}
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length)}
            style={controlBtnStyle}
          >
            <svg viewBox="0 0 24 24" fill="white" style={{ width: '16px', height: '16px' }}>
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            style={{ ...controlBtnStyle, width: '48px', height: '48px' }}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="white" style={{ width: '20px', height: '20px' }}>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="white" style={{ width: '20px', height: '20px' }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % photos.length)}
            style={controlBtnStyle}
          >
            <svg viewBox="0 0 24 24" fill="white" style={{ width: '16px', height: '16px' }}>
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>

        {/* Right: Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Speed */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {INTERVALS.map(i => (
              <button
                key={i.value}
                onClick={() => setInterval_(i.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: interval === i.value ? 'rgba(255,255,255,0.25)' : 'transparent',
                  color: interval === i.value ? 'white' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {i.label}
              </button>
            ))}
          </div>

          {/* Transition */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {TRANSITIONS.map(t => (
              <button
                key={t.value}
                onClick={() => setTransition(t.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: transition === t.value ? 'rgba(255,255,255,0.25)' : 'transparent',
                  color: transition === t.value ? 'white' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} style={controlBtnStyle} title="Fullscreen (F)">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
              {isFullscreen ? (
                <>
                  <polyline points="4 14 8 14 8 18" />
                  <polyline points="20 10 16 10 16 6" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </>
              ) : (
                <>
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </>
              )}
            </svg>
          </button>

          {/* Exit */}
          <Link
            to={`/album/${id}`}
            style={{
              ...controlBtnStyle,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Exit slideshow"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Progress dots */}
      {photos.length <= 30 && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '4px',
          opacity: showControls ? 0.6 : 0,
          transition: 'opacity 0.5s ease',
          zIndex: 10,
        }}>
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? '16px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(1.05); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInDown {
          from { transform: translateY(-12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const controlBtnStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.15)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s ease',
  backdropFilter: 'blur(8px)',
}
