import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

/**
 * Wedding Color Palette Generator — a free planning tool.
 *
 * Couples pick a base color, and we generate a harmonious 5-color
 * wedding palette with complementary, analogous, and accent tones.
 * They can copy hex codes to share with vendors, florists, etc.
 *
 * Lives at /tools/colors — first of the "wedding planning tools" add-ons.
 */

// ── Curated Wedding Palettes ────────────────────────────────
const CURATED = [
  {
    name: 'Champagne & Sage',
    colors: ['#B8976A', '#A8B5A0', '#F5F0EB', '#6B5E54', '#D4C8BA'],
    tags: ['classic', 'garden', 'fall'],
  },
  {
    name: 'Dusty Rose & Navy',
    colors: ['#C9A5A0', '#2C3E5A', '#F2E8E5', '#8B6F6A', '#E8D5D0'],
    tags: ['romantic', 'elegant', 'winter'],
  },
  {
    name: 'Terracotta & Olive',
    colors: ['#C87F5A', '#6B7B4A', '#F5EDE3', '#8B5E3C', '#D4C4A0'],
    tags: ['boho', 'desert', 'fall'],
  },
  {
    name: 'Lavender & Gold',
    colors: ['#9B8FBF', '#C4A962', '#F0ECF5', '#6B5E80', '#E0D5C0'],
    tags: ['whimsical', 'spring', 'luxe'],
  },
  {
    name: 'Blush & Burgundy',
    colors: ['#E8C4C4', '#6B2D3E', '#FFF5F5', '#8B4A5A', '#D4A0A0'],
    tags: ['romantic', 'winter', 'dramatic'],
  },
  {
    name: 'Ocean Blue & Sand',
    colors: ['#5B8BA0', '#D4C4A0', '#F0F5F8', '#3D6B80', '#E8DFD5'],
    tags: ['beach', 'coastal', 'summer'],
  },
  {
    name: 'Emerald & Ivory',
    colors: ['#2D6B4A', '#F5F0E8', '#B8D4C4', '#1A4A30', '#E0D5C0'],
    tags: ['classic', 'luxe', 'garden'],
  },
  {
    name: 'Sunset Peach',
    colors: ['#E8A87C', '#D4766A', '#FFF0E8', '#C45B4A', '#F5D4C0'],
    tags: ['summer', 'tropical', 'warm'],
  },
  {
    name: 'Mauve & Gray',
    colors: ['#B0899A', '#8B8B8B', '#F5F0F2', '#6B5060', '#D4C8D0'],
    tags: ['modern', 'minimal', 'winter'],
  },
  {
    name: 'Citrus Garden',
    colors: ['#D4A030', '#6B8B4A', '#FFF8E8', '#8B7020', '#E8E0C0'],
    tags: ['summer', 'garden', 'bright'],
  },
  {
    name: 'Midnight & Stars',
    colors: ['#1A2040', '#C4A962', '#E8E4F0', '#3D4060', '#8B80A0'],
    tags: ['dramatic', 'winter', 'luxe'],
  },
  {
    name: 'All White & Green',
    colors: ['#FFFFFF', '#4A6B4A', '#F5F5F5', '#8BAB8B', '#E0E8E0'],
    tags: ['minimal', 'classic', 'garden'],
  },
]

const ALL_TAGS = [...new Set(CURATED.flatMap(p => p.tags))].sort()

export default function ColorPalette() {
  const [selectedPalette, setSelectedPalette] = useState(null)
  const [customColors, setCustomColors] = useState(['#B8976A', '#A8B5A0', '#F5F0EB', '#6B5E54', '#D4C8BA'])
  const [activeTag, setActiveTag] = useState(null)
  const [copied, setCopied] = useState(null)
  const [mode, setMode] = useState('curated') // curated or custom

  const copyColor = useCallback((hex) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(hex)
      setTimeout(() => setCopied(null), 1500)
    })
  }, [])

  const copyAllColors = useCallback((colors) => {
    const text = colors.join(', ')
    navigator.clipboard.writeText(text).then(() => {
      setCopied('all')
      setTimeout(() => setCopied(null), 1500)
    })
  }, [])

  const updateCustomColor = (index, value) => {
    setCustomColors(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  // Generate complementary colors from a base
  const generateFromBase = (hex) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    const palette = [
      hex,
      hslToHex((hsl.h + 30) % 360, Math.max(hsl.s - 15, 10), Math.min(hsl.l + 10, 90)),
      hslToHex(hsl.h, Math.max(hsl.s - 40, 5), Math.min(hsl.l + 35, 96)),
      hslToHex((hsl.h + 180) % 360, Math.max(hsl.s - 10, 15), Math.max(hsl.l - 15, 20)),
      hslToHex((hsl.h + 15) % 360, Math.max(hsl.s - 25, 10), Math.min(hsl.l + 20, 88)),
    ]
    setCustomColors(palette)
  }

  const filteredPalettes = activeTag
    ? CURATED.filter(p => p.tags.includes(activeTag))
    : CURATED

  const displayColors = selectedPalette ? selectedPalette.colors : customColors

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: '#B8976A', marginBottom: '16px' }}>
              First Look
            </p>
          </Link>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 400, color: '#3D3530', marginBottom: '12px' }}>
            Wedding Color Palette
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#6B5E54', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            Find the perfect color palette for your wedding. Tap any color to copy the hex code and share with your vendors, florist, and wedding party.
          </p>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '4px', background: '#F5F0EB', borderRadius: '8px', padding: '3px' }}>
            {[
              { key: 'curated', label: 'Curated Palettes' },
              { key: 'custom', label: 'Build Your Own' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setMode(tab.key); setSelectedPalette(null) }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  background: mode === tab.key ? 'white' : 'transparent',
                  color: mode === tab.key ? '#3D3530' : '#9C8F87',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: mode === tab.key ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: mode === tab.key ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'curated' ? (
          <>
            {/* Tag Filters */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' }}>
              <button
                onClick={() => setActiveTag(null)}
                style={tagStyle(!activeTag)}
              >
                All
              </button>
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  style={tagStyle(activeTag === tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Palette Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }}>
              {filteredPalettes.map(palette => (
                <button
                  key={palette.name}
                  onClick={() => setSelectedPalette(selectedPalette?.name === palette.name ? null : palette)}
                  style={{
                    background: 'white',
                    border: selectedPalette?.name === palette.name ? '2px solid #B8976A' : '1px solid #D4C8BA',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Color Swatches Row */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden' }}>
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        style={{
                          flex: i === 0 ? 2 : 1,
                          height: '48px',
                          backgroundColor: color,
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '16px', color: '#3D3530', fontWeight: 500, margin: '0 0 4px' }}>
                    {palette.name}
                  </p>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {palette.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#9C8F87', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Custom Mode */
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B5E54', textAlign: 'center', marginBottom: '20px' }}>
              Pick a starting color and we'll generate a harmonious palette, or customize each color individually.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5E54' }}>Start from:</span>
                <input
                  type="color"
                  value={customColors[0]}
                  onChange={(e) => generateFromBase(e.target.value)}
                  style={{ width: '48px', height: '36px', border: '1px solid #D4C8BA', borderRadius: '6px', cursor: 'pointer', padding: '2px' }}
                />
              </label>
            </div>
          </div>
        )}

        {/* Selected/Active Palette Detail */}
        {(selectedPalette || mode === 'custom') && (
          <div style={{ background: 'white', border: '1px solid #D4C8BA', borderRadius: '12px', padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 400, color: '#3D3530', margin: 0 }}>
                {selectedPalette ? selectedPalette.name : 'Your Custom Palette'}
              </h3>
              <button
                onClick={() => copyAllColors(displayColors)}
                style={{
                  padding: '6px 14px',
                  background: copied === 'all' ? '#B8976A' : '#F5F0EB',
                  color: copied === 'all' ? 'white' : '#3D3530',
                  border: '1px solid #D4C8BA',
                  borderRadius: '6px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {copied === 'all' ? 'Copied all!' : 'Copy All Hex Codes'}
              </button>
            </div>

            {/* Large Swatches */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {displayColors.map((color, i) => (
                <div
                  key={i}
                  onClick={() => copyColor(color)}
                  style={{
                    flex: '1 1 80px',
                    minWidth: '80px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{
                    height: '80px',
                    backgroundColor: color,
                    borderRadius: '8px',
                    border: isLight(color) ? '1px solid #D4C8BA' : 'none',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {copied === color && (
                      <svg viewBox="0 0 24 24" fill="none" stroke={isLight(color) ? '#3D3530' : 'white'} strokeWidth="2.5" style={{ width: '20px', height: '20px' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {mode === 'custom' ? (
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateCustomColor(i, e.target.value)}
                      style={{ width: '100%', height: '24px', border: '1px solid #E8DFD5', borderRadius: '4px', cursor: 'pointer', padding: '1px' }}
                    />
                  ) : null}
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px',
                    color: '#6B5E54',
                    fontFamily: 'monospace',
                    margin: '4px 0 0',
                  }}>
                    {color.toUpperCase()}
                  </p>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '10px',
                    color: '#9C8F87',
                    margin: '2px 0 0',
                  }}>
                    {['Primary', 'Secondary', 'Background', 'Accent', 'Neutral'][i]}
                  </p>
                </div>
              ))}
            </div>

            {/* Vendor Share Tip */}
            <div style={{
              marginTop: '24px',
              padding: '14px 16px',
              background: '#FDF8F0',
              border: '1px solid #E8DFD5',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: '#6B5E54',
              lineHeight: 1.5,
            }}>
              <strong>Tip:</strong> Copy these hex codes and send them to your florist, caterer, decorator, and stationery designer so everything matches perfectly.
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #E8DFD5' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', fontWeight: 400, color: '#3D3530', marginBottom: '12px' }}>
            Ready to capture every moment?
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B5E54', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
            First Look lets your guests share photos via QR code and displays them live on a slideshow during your reception.
          </p>
          <Link
            to="/checkout"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: '#B8976A',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Get First Look — $99
          </Link>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '16px', color: '#9C8F87' }}>
            <Link to="/" style={{ color: '#B8976A', textDecoration: 'none' }}>First Look</Link> — Wedding tools that just work
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────

function tagStyle(active) {
  return {
    padding: '5px 12px',
    borderRadius: '20px',
    border: active ? '1px solid #B8976A' : '1px solid #D4C8BA',
    background: active ? '#B8976A' : 'white',
    color: active ? 'white' : '#6B5E54',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    cursor: 'pointer',
    textTransform: 'capitalize',
    transition: 'all 0.15s ease',
  }
}

function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/.{2}/g)
  if (!m) return null
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) }
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function isLight(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return true
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 180
}

const pageStyle = {
  minHeight: '100vh',
  background: '#FBF9F6',
  padding: '20px',
}

const containerStyle = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '40px 0',
}
