import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getAlbum } from '../services/storage'
import { trackEvent } from '../utils/analytics'

const SIZES = {
  full: { label: 'Full Page (8.5 × 11")', width: 816, height: 1056, perPage: 1 },
  quarter: { label: 'Quarter Page (4.25 × 5.5")', width: 408, height: 528, perPage: 4 },
}

const PRESETS = [
  { name: 'Champagne Gold', primary: '#B8976A', accent: '#C9917A', bg: '#FBF9F6', text: '#3D3530' },
  { name: 'Blush Rose', primary: '#C9917A', accent: '#B8976A', bg: '#FAF0EB', text: '#3D3530' },
  { name: 'Sage Garden', primary: '#7D9B76', accent: '#A8C09B', bg: '#F5F7F2', text: '#2D3A28' },
  { name: 'Dusty Blue', primary: '#7B9DB7', accent: '#A3BFD4', bg: '#F2F6F9', text: '#2A3640' },
  { name: 'Lavender', primary: '#9B8EC4', accent: '#B8ACD6', bg: '#F5F3FA', text: '#2D2640' },
  { name: 'Classic Black', primary: '#3D3530', accent: '#6B5E56', bg: '#FFFFFF', text: '#3D3530' },
]

export default function TableSignGenerator() {
  const { id } = useParams()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState('full')
  const [preset, setPreset] = useState(0)
  const [customColors, setCustomColors] = useState(null)
  const [headingText, setHeadingText] = useState('Share Your Photos')
  const [subText, setSubText] = useState('Scan the QR code to upload your favorite moments')
  const [showNames, setShowNames] = useState(true)
  const [coupleNames, setCoupleNames] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const printRef = useRef(null)

  const colors = customColors || PRESETS[preset]

  useEffect(() => {
    async function load() {
      try {
        const a = await getAlbum(id)
        setAlbum(a)
      } catch (err) {
        console.error('Failed to load album:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const shareUrl = album ? `${window.location.origin}/share/${album.shareCode}` : ''
  const uploadUrl = album ? `${window.location.origin}/upload/${album.shareCode}` : ''

  function handlePrint() {
    trackEvent('QR Sign Printed', { size })
    window.print()
  }

  function handleDownloadPNG() {
    const el = printRef.current
    if (!el) return

    // Use html2canvas-like approach via SVG foreignObject
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const sizeConfig = SIZES[size]
    const scale = 2 // 2x for crisp output
    svg.setAttribute('width', sizeConfig.width * scale)
    svg.setAttribute('height', (size === 'quarter' ? sizeConfig.height * 2 : sizeConfig.height) * scale)

    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    fo.setAttribute('width', '100%')
    fo.setAttribute('height', '100%')

    const clone = el.cloneNode(true)
    clone.style.transform = `scale(${scale})`
    clone.style.transformOrigin = 'top left'
    fo.appendChild(clone)
    svg.appendChild(fo)

    // Fallback: just trigger print which has "Save as PDF"
    window.print()
  }

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Album not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>Back to Albums</Link>
      </div>
    )
  }

  const SignCard = ({ qrUrl, qrLabel }) => (
    <div style={{
      width: size === 'quarter' ? '50%' : '100%',
      height: size === 'quarter' ? '50%' : '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: size === 'quarter' ? '24px' : '48px',
      backgroundColor: colors.bg,
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* Decorative top border */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: size === 'quarter' ? '20%' : '15%',
        right: size === 'quarter' ? '20%' : '15%',
        height: '3px',
        backgroundColor: colors.primary,
        borderRadius: '0 0 2px 2px',
      }} />

      {/* Couple Names */}
      {showNames && coupleNames && (
        <p style={{
          fontFamily: "'Cormorant Garabond', Georgia, serif",
          fontSize: size === 'quarter' ? '14px' : '20px',
          color: colors.accent,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: size === 'quarter' ? '8px' : '16px',
          fontWeight: 300,
        }}>
          {coupleNames}
        </p>
      )}

      {/* Heading */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: size === 'quarter' ? '22px' : '40px',
        fontWeight: 400,
        color: colors.text,
        marginBottom: size === 'quarter' ? '6px' : '12px',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        {headingText}
      </h2>

      {/* Subtext */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: size === 'quarter' ? '10px' : '16px',
        color: colors.accent,
        marginBottom: size === 'quarter' ? '16px' : '32px',
        textAlign: 'center',
        maxWidth: size === 'quarter' ? '80%' : '70%',
        lineHeight: 1.4,
      }}>
        {subText}
      </p>

      {/* QR Code */}
      <div style={{
        padding: size === 'quarter' ? '12px' : '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: `2px solid ${colors.primary}`,
        marginBottom: size === 'quarter' ? '12px' : '24px',
        lineHeight: 0,
      }}>
        <QRCodeSVG
          value={qrUrl}
          size={size === 'quarter' ? 100 : 200}
          level="H"
          includeMargin={false}
          bgColor="#FFFFFF"
          fgColor={colors.text}
        />
      </div>

      {/* QR Label */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: size === 'quarter' ? '8px' : '12px',
        color: colors.accent,
        letterSpacing: '0.5px',
        marginBottom: size === 'quarter' ? '8px' : '16px',
      }}>
        {qrLabel}
      </p>

      {/* Wedding Date */}
      {weddingDate && (
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: size === 'quarter' ? '11px' : '16px',
          color: colors.text,
          fontStyle: 'italic',
          opacity: 0.7,
        }}>
          {weddingDate}
        </p>
      )}

      {/* Decorative bottom border */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: size === 'quarter' ? '20%' : '15%',
        right: size === 'quarter' ? '20%' : '15%',
        height: '3px',
        backgroundColor: colors.primary,
        borderRadius: '2px 2px 0 0',
      }} />
    </div>
  )

  return (
    <>
      {/* Screen UI — hidden when printing */}
      <div className="page no-print" style={{ animation: 'fadeIn 0.3s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            to={`/album/${id}`}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px',
            }}
          >
            ← Back to {album.name}
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            Table Signs
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}>
            Customize and print QR code signs for your reception tables
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Controls Panel */}
          <div style={{
            padding: '24px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            position: 'sticky',
            top: '100px',
          }}>
            {/* Size */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '10px',
              }}>
                Sign Size
              </label>
              {Object.entries(SIZES).map(([key, val]) => (
                <label key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: size === key ? 'var(--bg-primary)' : 'transparent',
                  border: `1px solid ${size === key ? 'var(--accent)' : 'transparent'}`,
                  marginBottom: '6px',
                  transition: 'all 0.15s ease',
                }}>
                  <input
                    type="radio"
                    name="size"
                    checked={size === key}
                    onChange={() => setSize(key)}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {val.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {val.perPage === 1 ? 'One sign per page' : 'Four signs per page — perfect for tabletop'}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Color Presets */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '10px',
              }}>
                Color Theme
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => { setPreset(i); setCustomColors(null) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      border: `1px solid ${preset === i && !customColors ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: preset === i && !customColors ? 'var(--bg-primary)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: p.primary,
                      border: '2px solid white',
                      boxShadow: '0 0 0 1px ' + p.primary,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-primary)' }}>
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '10px',
              }}>
                Custom Colors
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { label: 'Primary', key: 'primary' },
                  { label: 'Accent', key: 'accent' },
                  { label: 'Background', key: 'bg' },
                ].map(({ label, key }) => (
                  <div key={key} style={{ flex: 1, textAlign: 'center' }}>
                    <input
                      type="color"
                      value={colors[key]}
                      onChange={(e) => {
                        const base = customColors || { ...PRESETS[preset] }
                        setCustomColors({ ...base, [key]: e.target.value })
                      }}
                      style={{
                        width: '100%',
                        height: '32px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                    />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Fields */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '10px',
              }}>
                Sign Text
              </label>
              <input
                type="text"
                value={headingText}
                onChange={(e) => setHeadingText(e.target.value)}
                placeholder="Heading text"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  marginBottom: '8px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                }}
              />
              <input
                type="text"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="Description text"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Couple Names */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={showNames}
                  onChange={(e) => setShowNames(e.target.checked)}
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Show Names & Date
                </span>
              </label>
              {showNames && (
                <>
                  <input
                    type="text"
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    placeholder="e.g. Sarah & James"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      marginBottom: '8px',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <input
                    type="text"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    placeholder="e.g. June 15, 2026"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                    }}
                  />
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handlePrint}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Print / Save as PDF
              </button>
            </div>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '12px',
              lineHeight: 1.4,
              textAlign: 'center',
            }}>
              Use your browser's print dialog to save as PDF or send directly to a printer
            </p>
          </div>

          {/* Preview */}
          <div>
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            }}>
              <div
                ref={printRef}
                style={{
                  width: '100%',
                  aspectRatio: size === 'quarter' ? '8.5 / 11' : '8.5 / 11',
                  display: size === 'quarter' ? 'grid' : 'flex',
                  gridTemplateColumns: size === 'quarter' ? '1fr 1fr' : undefined,
                  gridTemplateRows: size === 'quarter' ? '1fr 1fr' : undefined,
                  backgroundColor: colors.bg,
                }}
              >
                {size === 'quarter' ? (
                  <>
                    <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
                    <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
                    <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
                    <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
                  </>
                ) : (
                  <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
                )}
              </div>
            </div>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '16px',
            }}>
              {size === 'quarter'
                ? 'Four signs per page — cut along the center lines after printing'
                : 'One full-page sign — great for standing frames or easels'
              }
            </p>
          </div>
        </div>

        {/* Responsive */}
        <style>{`
          @media (max-width: 768px) {
            .page > div:last-of-type {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>

      {/* Print-only content */}
      <div className="print-only" style={{ display: 'none' }}>
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: size === 'quarter' ? 'grid' : 'flex',
            gridTemplateColumns: size === 'quarter' ? '1fr 1fr' : undefined,
            gridTemplateRows: size === 'quarter' ? '1fr 1fr' : undefined,
            backgroundColor: colors.bg,
            margin: 0,
            padding: 0,
          }}
        >
          {size === 'quarter' ? (
            <>
              <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
              <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
              <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
              <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
            </>
          ) : (
            <SignCard qrUrl={uploadUrl} qrLabel="Point your camera to upload photos" />
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { margin: 0; padding: 0; background: white !important; }
          @page { margin: 0; size: letter; }
          nav, header, footer, .page-header { display: none !important; }
          /* Ensure signs fill the page and don't break mid-sign */
          .sign-preview { break-inside: avoid; page-break-inside: avoid; }
          /* Remove box shadows and borders that waste ink */
          * { box-shadow: none !important; }
          /* Ensure QR codes print at full resolution */
          svg { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          /* Background colors for the signs */
          .sign-preview * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </>
  )
}
