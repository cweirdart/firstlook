import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as storage from '../services/storage'

/**
 * Wedding Day Setup Guide — designed to be shared with the best man,
 * maid of honor, DJ, or whoever is helping set up on the day.
 *
 * Accessible at /album/:id/setup
 * Can also be shared directly via a "Send setup link" button.
 */
export default function SetupGuide() {
  const { id } = useParams()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const a = await storage.getAlbum(id)
        setAlbum(a)
      } catch (err) {
        console.error('Failed to load album:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const origin = window.location.origin
  const uploadUrl = album ? `${origin}/upload/${album.shareCode}` : ''
  const tvUrl = album ? `${origin}/tv/${id}` : ''
  const slideshowUrl = album ? `${origin}/album/${id}/slideshow` : ''
  const signsUrl = album ? `${origin}/album/${id}/signs` : ''
  const setupUrl = album ? `${origin}/album/${id}/setup` : ''

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const shareSetupGuide = () => {
    const text = `Hey! Here's everything you need to set up the photo slideshow for the wedding:\n\n${setupUrl}\n\nThe guide has all the links and steps. Thank you!`
    if (navigator.share) {
      navigator.share({ title: 'Wedding Photo Setup Guide', text }).catch(() => {
        copyToClipboard(text, 'message')
      })
    } else {
      copyToClipboard(text, 'message')
    }
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={spinnerStyle} />
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginTop: '16px' }}>Loading setup guide...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!album) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={headingStyle}>Album Not Found</h2>
          <Link to="/" style={linkBtnStyle}>Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
            Wedding Day Setup Guide
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {album.name}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything the setup person needs to get the live photo slideshow running. No account needed — just follow these steps.
          </p>
        </div>

        {/* Send to helper button */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button onClick={shareSetupGuide} style={primaryBtnStyle}>
            {copied === 'message' ? 'Copied to clipboard!' : 'Send This Guide to Your Helper'}
          </button>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Text or email this page to your best man, DJ, or venue coordinator
          </p>
        </div>

        {/* Step 1: Table Signs */}
        <div style={stepCardStyle}>
          <div style={stepNumberStyle}>1</div>
          <h3 style={stepTitleStyle}>Print the Table Signs</h3>
          <p style={stepDescStyle}>
            Each sign has a QR code that guests scan to upload photos directly from their phone. No app download needed — it opens right in their browser.
          </p>
          <div style={stepActionsStyle}>
            <a href={signsUrl} target="_blank" rel="noopener noreferrer" style={actionBtnStyle}>
              Open Sign Generator
            </a>
            <p style={stepHintStyle}>Print on cardstock, one per table. We recommend the quarter-page size for table centerpieces.</p>
          </div>
        </div>

        {/* Step 2: Set Up the Display */}
        <div style={stepCardStyle}>
          <div style={stepNumberStyle}>2</div>
          <h3 style={stepTitleStyle}>Set Up the Photo Display</h3>
          <p style={stepDescStyle}>
            Open one of these links on any screen — a venue TV, a laptop connected to a projector, a Fire Stick, an old iPad on a stand, or any device with a browser. It runs all night on its own.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <div style={linkRowStyle}>
              <div>
                <strong style={linkLabelStyle}>TV Display</strong>
                <span style={linkDescStyle}> — Full-screen, auto-advances, shows QR code overlay. Best for TVs and projectors.</span>
              </div>
              <button onClick={() => copyToClipboard(tvUrl, 'tv')} style={copyBtnStyle}>
                {copied === 'tv' ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <div style={linkRowStyle}>
              <div>
                <strong style={linkLabelStyle}>Slideshow</strong>
                <span style={linkDescStyle}> — Playback controls, transition effects, keyboard shortcuts. Best for laptops.</span>
              </div>
              <button onClick={() => copyToClipboard(slideshowUrl, 'slideshow')} style={copyBtnStyle}>
                {copied === 'slideshow' ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
          <div style={tipBoxStyle}>
            <strong>Device ideas:</strong> Smart TV browser, Amazon Fire Stick ($30), old iPad or tablet on a stand, any laptop connected to a projector, even an old phone propped up on a shelf. Anything with a web browser works.
          </div>
        </div>

        {/* Step 3: Share the Upload Link */}
        <div style={stepCardStyle}>
          <div style={stepNumberStyle}>3</div>
          <h3 style={stepTitleStyle}>Share the Upload Link (Optional)</h3>
          <p style={stepDescStyle}>
            Besides the QR codes on the tables, you can also text or airdrop this link directly to guests.
          </p>
          <div style={linkRowStyle}>
            <div>
              <strong style={linkLabelStyle}>Guest Upload Page</strong>
              <span style={linkDescStyle}> — Guests can upload photos + leave a message</span>
            </div>
            <button onClick={() => copyToClipboard(uploadUrl, 'upload')} style={copyBtnStyle}>
              {copied === 'upload' ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Step 4: Enjoy */}
        <div style={stepCardStyle}>
          <div style={stepNumberStyle}>4</div>
          <h3 style={stepTitleStyle}>That's It — Enjoy the Party</h3>
          <p style={stepDescStyle}>
            Photos appear on the display in real time as guests upload them. No one needs to manage anything. The couple can check their album anytime from their dashboard, but they don't have to touch anything today.
          </p>
          <div style={tipBoxStyle}>
            <strong>Heads up:</strong> Keep the display device plugged in and connected to WiFi. If the browser accidentally closes, just reopen the link — it picks right back up.
          </div>
        </div>

        {/* Troubleshooting */}
        <div style={{ ...stepCardStyle, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
          <h3 style={{ ...stepTitleStyle, fontSize: '18px' }}>Quick Troubleshooting</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {[
              ['Photos aren\'t showing up', 'Make sure the display device is connected to WiFi. Refresh the page. Photos appear within seconds of upload.'],
              ['QR code won\'t scan', 'Make sure the guest is using their phone camera (not a QR app). The camera app on iPhone and Android both scan QR codes natively.'],
              ['Screen went to sleep', 'Tap to wake it up — the slideshow is still running. On tablets, turn off auto-lock in Settings before the event.'],
              ['Guest says "page not found"', 'Double-check the QR code link. The guest needs an internet connection on their phone.'],
            ].map(([q, a]) => (
              <div key={q}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{q}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid var(--border)', marginTop: '20px' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: 'var(--text-muted)', fontWeight: 300 }}>
            Powered by <a href={origin} style={{ color: 'var(--accent)', textDecoration: 'none' }}>First Look</a>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────

const pageStyle = {
  minHeight: '100vh',
  background: '#FBF9F6',
  padding: '20px',
}

const containerStyle = {
  maxWidth: '640px',
  margin: '0 auto',
  padding: '40px 0',
}

const headingStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '28px',
  fontWeight: 400,
  color: '#3D3530',
}

const spinnerStyle = {
  width: '32px',
  height: '32px',
  border: '2px solid #E8DFD5',
  borderTopColor: '#B8976A',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  margin: '0 auto',
}

const primaryBtnStyle = {
  padding: '14px 28px',
  background: '#B8976A',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '15px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.15s ease',
}

const linkBtnStyle = {
  display: 'inline-block',
  padding: '12px 24px',
  background: '#B8976A',
  color: 'white',
  borderRadius: '8px',
  textDecoration: 'none',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
}

const stepCardStyle = {
  background: 'white',
  border: '1px solid #D4C8BA',
  borderRadius: '12px',
  padding: '28px',
  marginBottom: '20px',
  position: 'relative',
}

const stepNumberStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: '#B8976A',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  marginBottom: '16px',
}

const stepTitleStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '22px',
  fontWeight: 400,
  color: '#3D3530',
  marginBottom: '10px',
}

const stepDescStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  color: '#6B5E54',
  lineHeight: 1.6,
  margin: 0,
}

const stepActionsStyle = {
  marginTop: '16px',
}

const stepHintStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px',
  color: '#9C8F87',
  marginTop: '8px',
  margin: '8px 0 0',
}

const actionBtnStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  background: '#F5F0EB',
  color: '#3D3530',
  border: '1px solid #D4C8BA',
  borderRadius: '8px',
  textDecoration: 'none',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '13px',
  fontWeight: 500,
}

const linkRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  background: '#FBF9F6',
  borderRadius: '8px',
  border: '1px solid #E8DFD5',
  gap: '12px',
  flexWrap: 'wrap',
}

const linkLabelStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '13px',
  color: '#3D3530',
}

const linkDescStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px',
  color: '#9C8F87',
}

const copyBtnStyle = {
  padding: '6px 14px',
  background: 'white',
  border: '1px solid #D4C8BA',
  borderRadius: '6px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px',
  color: '#3D3530',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
}

const tipBoxStyle = {
  marginTop: '16px',
  padding: '14px 16px',
  background: '#FDF8F0',
  border: '1px solid #E8DFD5',
  borderRadius: '8px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '13px',
  color: '#6B5E54',
  lineHeight: 1.5,
}
