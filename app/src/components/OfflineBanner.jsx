import { useState, useEffect } from 'react'

/**
 * Shows a non-intrusive banner when the user loses internet connection.
 * Critical for wedding day — if venue WiFi drops, guests and the display
 * need to know what's happening.
 *
 * Auto-hides when connection is restored.
 */
export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => {
      setIsOffline(false)
      setShowReconnected(true)
      setTimeout(() => setShowReconnected(false), 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline && !showReconnected) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '10px 16px',
        textAlign: 'center',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        fontWeight: 500,
        animation: 'slideDown 0.3s ease',
        background: isOffline
          ? 'linear-gradient(135deg, #C87F5A 0%, #B86A45 100%)'
          : 'linear-gradient(135deg, #6B8B4A 0%, #5A7A3A 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      {isOffline ? (
        <>
          <strong>No internet connection.</strong> Photos will upload once you're back online. Check your WiFi or try a mobile hotspot.
        </>
      ) : (
        <>Back online — you're all set!</>
      )}
    </div>
  )
}
