import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import * as storage from '../services/storage'

/**
 * TV Display Mode — optimized for reception screens.
 *
 * Access patterns (post-backend):
 *   /tv            → PIN entry screen (type the 4-digit PIN shown on couple's phone)
 *   /tv/:albumId   → Direct slideshow (used internally after PIN verification)
 *   /tv?pin=XXXX   → Auto-connect via PIN from QR scan
 *
 * For now (pre-backend), accessed via /tv/:albumId directly.
 *
 * Designed for: Smart TV browsers, Fire Stick Silk, Chromecast, AirPlay, projectors.
 * Features: extra-large photos, no small text, remote-friendly, auto-advances,
 *           shows new photos in real-time, optional "Upload your photos!" QR overlay.
 */

export default function TVDisplay() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [album, setAlbum] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showQR, setShowQR] = useState(true)
  const [photoCount, setPhotoCount] = useState(0)
  const [newPhotoFlash, setNewPhotoFlash] = useState(false)
  const containerRef = useRef(null)
  const intervalRef = useRef(null)
  const previousCount = useRef(0)

  // Load album
  useEffect(() => {
    async function load() {
      try {
        const a = await storage.getAlbum(id)
        if (a) {
          setAlbum(a)
          const p = await storage.getPhotosByAlbum(id)
          const visible = p.filter(ph => ph.status !== 'rejected' && ph.status !== 'pending')
          const final = visible.length > 0 ? visible : p.filter(ph => ph.status !== 'rejected')
          setPhotos(final)
          setPhotoCount(final.length)
          previousCount.current = final.length
        }
      } catch (err) {
        console.error('TV Display load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Realtime subscription for new photos (replaces polling)
  useEffect(() => {
    const unsubscribe = storage.subscribeToPhotos(id, (newPhoto) => {
      if (newPhoto.status !== 'rejected' && newPhoto.status !== 'pending') {
        setPhotos(prev => {
          if (prev.find(p => p.id === newPhoto.id)) return prev
          return [...prev, newPhoto]
        })
        setPhotoCount(prev => prev + 1)
        previousCount.current += 1
        setNewPhotoFlash(true)
        setTimeout(() => setNewPhotoFlash(false), 3000)
      }
    })
    return unsubscribe
  }, [id])

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (photos.length > 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % photos.length)
      }, 6000)
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [photos.length])

  // Toggle QR overlay with any keypress or click
  useEffect(() => {
    function toggle() { setShowQR(prev => !prev) }
    window.addEventListener('keydown', toggle)
    return () => window.removeEventListener('keydown', toggle)
  }, [])

  // Auto-fullscreen on load
  useEffect(() => {
    const timer = setTimeout(() => {
      containerRef.current?.requestFullscreen?.().catch(() => {})
    }, 1000)
    return () => clearTimeout(timer)
  }, [loading])

  if (loading) {
    return (
      <div style={screenStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(32px, 5vw, 64px)',
            color: 'white',
            fontWeight: 300,
            marginBottom: '16px',
          }}>
            Loading...
          </div>
        </div>
      </div>
    )
  }

  // Waiting for photos state — show QR code prominently
  if (!album || photos.length === 0) {
    const uploadUrl = album ? `${window.location.origin}/upload/${album.shareCode}` : ''
    return (
      <div ref={containerRef} style={screenStyle}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 300,
            color: 'white',
            marginBottom: '24px',
            lineHeight: 1.2,
          }}>
            {album?.name || 'First Look'}
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(16px, 2.5vw, 28px)',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '48px',
          }}>
            Scan the QR code to share your photos
          </p>

          {/* Big QR Code */}
          {uploadUrl && (
            <div style={{
              display: 'inline-block',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              marginBottom: '32px',
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(uploadUrl)}&margin=0`}
                alt="Upload QR Code"
                style={{ width: '280px', height: '280px', display: 'block' }}
              />
            </div>
          )}

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(14px, 2vw, 20px)',
            color: 'rgba(255,255,255,0.4)',
          }}>
            Photos will appear here as guests upload them
          </p>
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        `}</style>
      </div>
    )
  }

  const photo = photos[currentIndex]
  const uploadUrl = `${window.location.origin}/upload/${album.shareCode}`

  return (
    <div
      ref={containerRef}
      onClick={() => setShowQR(prev => !prev)}
      style={screenStyle}
    >
      {/* Current Photo — full bleed */}
      <div
        key={photo.id + '-' + currentIndex}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'tvFadeIn 1.2s ease-in-out',
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

      {/* Subtle gradient at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '180px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
        pointerEvents: 'none',
      }} />

      {/* Bottom bar — album name + photo counter */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '40px',
        right: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        <div>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(20px, 3vw, 36px)',
            color: 'white',
            fontWeight: 300,
            margin: 0,
            opacity: 0.8,
          }}>
            {album.name}
          </p>
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(12px, 1.5vw, 18px)',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {photoCount} photos
        </div>
      </div>

      {/* QR Code Overlay — toggle with click/keypress */}
      {showQR && (
        <div style={{
          position: 'absolute',
          bottom: '32px',
          right: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'tvFadeIn 0.5s ease',
          pointerEvents: 'none',
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '12px',
            marginBottom: '8px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(uploadUrl)}&margin=0`}
              alt="Upload QR"
              style={{ width: '120px', height: '120px', display: 'block' }}
            />
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
          }}>
            Scan to add your photos
          </p>
        </div>
      )}

      {/* New Photo Flash */}
      {newPhotoFlash && (
        <div style={{
          position: 'absolute',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(184, 151, 106, 0.9)',
          color: 'white',
          padding: '12px 28px',
          borderRadius: '24px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(14px, 2vw, 20px)',
          fontWeight: 500,
          animation: 'tvSlideDown 0.5s ease-out',
          pointerEvents: 'none',
        }}>
          New photos added!
        </div>
      )}

      <style>{`
        @keyframes tvFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes tvSlideDown {
          from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

const screenStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: '#0a0a0a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  cursor: 'none',
}
