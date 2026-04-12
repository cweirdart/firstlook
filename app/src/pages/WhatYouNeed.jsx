import { Link } from 'react-router-dom'
import { usePageMeta } from '../utils/pageMeta'

/**
 * "What You Need" page — sets expectations + recommends display devices.
 *
 * Purposes:
 * 1. Prevent post-purchase surprise ("I need an iPad?!")
 * 2. Affiliate revenue from device recommendations
 * 3. SEO for "wedding slideshow setup" queries
 *
 * Amazon affiliate links use a placeholder tag (firstlook0e-20).
 * Replace with real Amazon Associates tag once account is set up.
 */

const AFFILIATE_TAG = 'firstlook0e-20' // Replace with real Amazon Associates tag

const devices = [
  {
    name: 'Amazon Fire TV Stick Lite',
    price: '$30',
    why: 'The cheapest way to put First Look on any TV with an HDMI port. Plug it in, open the Silk browser, enter the slideshow URL. Done.',
    best: 'Best for: any TV at the venue',
    asin: 'B09ZXJSW1P',
    tier: 'budget',
  },
  {
    name: 'Amazon Fire HD 8 Tablet',
    price: '$100',
    why: 'A standalone display you can prop on a table, bar, or gift table. Big enough for guests to see, small enough to tuck anywhere. Comes with a browser built in.',
    best: 'Best for: cocktail area, gift table, bar display',
    asin: 'B09BG5LY93',
    tier: 'mid',
  },
  {
    name: 'Tablet Stand (adjustable)',
    price: '$15',
    why: 'Props up any tablet or phone at the perfect angle. Foldable and portable — toss it in a bag with the tablet.',
    best: 'Best for: pairing with any tablet or old phone',
    asin: 'B07V2J4P1S',
    tier: 'accessory',
  },
  {
    name: 'iPad (10th gen)',
    price: '$349',
    why: 'If you already have an iPad, it makes a beautiful display. The larger screen draws guests in. You probably already own one — just bring it to the venue.',
    best: 'Best for: if you already own one',
    asin: 'B0BJLXMVMV',
    tier: 'premium',
  },
]

export default function WhatYouNeed() {
  usePageMeta(
    'What You Need for Wedding Photo Sharing',
    'Everything you need to run First Look at your wedding: WiFi, a screen, QR code signs, and 5 minutes. Recommended devices: Fire TV Stick ($30), tablets, iPads. No special equipment required.'
  )
  const amazonLink = (asin) =>
    `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={brandStyle}>First Look</p>
          </Link>
          <h1 style={h1Style}>What You Need for Your Wedding Day</h1>
          <p style={subtitleStyle}>
            First Look runs entirely in a web browser. Here's everything you need to set it up — most of which you probably already have.
          </p>
        </div>

        {/* Requirements */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>The Essentials</h2>

          <div style={reqCardStyle}>
            <div style={checkStyle}>✓</div>
            <div>
              <h3 style={reqTitleStyle}>WiFi at the venue</h3>
              <p style={reqDescStyle}>
                Guests need an internet connection to upload photos, and the display screen needs one to show them. Most venues have WiFi. If not, a mobile hotspot works too.
              </p>
            </div>
          </div>

          <div style={reqCardStyle}>
            <div style={checkStyle}>✓</div>
            <div>
              <h3 style={reqTitleStyle}>A screen for the slideshow</h3>
              <p style={reqDescStyle}>
                This is where photos appear live during the reception. It can be the venue's TV, a laptop connected to a projector, a Fire Stick ($30), a tablet on a stand, or even an old phone propped up on a shelf. <strong>Any device with a web browser works.</strong>
              </p>
            </div>
          </div>

          <div style={reqCardStyle}>
            <div style={checkStyle}>✓</div>
            <div>
              <h3 style={reqTitleStyle}>Printed QR code signs</h3>
              <p style={reqDescStyle}>
                First Look generates printable table signs with your QR code. Print them at home on cardstock, or at any office supply store. Place one on each table so guests can scan and upload from their phones.
              </p>
            </div>
          </div>

          <div style={reqCardStyle}>
            <div style={checkStyle}>✓</div>
            <div>
              <h3 style={reqTitleStyle}>Your best man, maid of honor, or DJ (5 minutes)</h3>
              <p style={reqDescStyle}>
                You shouldn't be setting up tech on your wedding day. Text the setup guide link to your best man, maid of honor, DJ, or venue coordinator — they open one URL on the display screen and put the signs on the tables. That's it. Takes about 5 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* What guests need */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>What Your Guests Need</h2>
          <div style={highlightBoxStyle}>
            <p style={{ ...reqDescStyle, margin: 0 }}>
              <strong>Just their phone.</strong> No app download, no account, no login. They point their camera at the QR code, tap the link, and upload photos. Works on iPhone, Android, and any modern smartphone browser. Takes about 10 seconds.
            </p>
          </div>
        </section>

        {/* Display device recommendations */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Recommended Display Devices</h2>
          <p style={{ ...reqDescStyle, marginBottom: '24px' }}>
            Don't have a screen for the slideshow? Here are our top picks at every budget. The links below support First Look at no extra cost to you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {devices.map(device => (
              <a
                key={device.asin}
                href={amazonLink(device.asin)}
                target="_blank"
                rel="noopener noreferrer"
                style={deviceCardStyle}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: '#3D3530', margin: 0 }}>
                      {device.name}
                    </h3>
                    <span style={priceTagStyle}>{device.price}</span>
                    {device.tier === 'budget' && <span style={bestValueStyle}>Best Value</span>}
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5E54', lineHeight: 1.5, margin: '0 0 4px' }}>
                    {device.why}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9C8F87', margin: 0 }}>
                    {device.best}
                  </p>
                </div>
                <div style={arrowStyle}>→</div>
              </a>
            ))}
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9C8F87', marginTop: '12px', textAlign: 'center' }}>
            Already have a tablet, laptop, or smart TV? You don't need to buy anything.
          </p>
        </section>

        {/* What you DON'T need */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>What You Don't Need</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'A photographer (but First Look complements one perfectly)',
              'Any app downloads for you or your guests',
              'Technical knowledge — if you can open a web browser, you can use First Look',
              'Someone to manage the slideshow during the event — it runs hands-free',
              'A monthly subscription — it\'s a one-time $99 purchase',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#C87F5A', fontWeight: 600, fontSize: '14px', marginTop: '1px' }}>✕</span>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B5E54', lineHeight: 1.5, margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 0 32px', borderTop: '1px solid #E8DFD5' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '26px', fontWeight: 400, color: '#3D3530', marginBottom: '12px' }}>
            Everything you need for $99
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B5E54', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Unlimited photos. Unlimited guests. Live slideshow. QR code signs. Guest book. Video messages. One price, no surprises.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/checkout" style={ctaBtnStyle}>Get First Look — $99</Link>
            <Link to="/how-it-works" style={secondaryBtnStyle}>See How It Works</Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '16px', color: '#9C8F87' }}>
            <Link to="/" style={{ color: '#B8976A', textDecoration: 'none' }}>First Look</Link> — Wedding photo sharing that just works
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────

const pageStyle = { minHeight: '100vh', background: '#FBF9F6', padding: '20px' }
const containerStyle = { maxWidth: '640px', margin: '0 auto', padding: '40px 0' }
const brandStyle = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: '#B8976A', marginBottom: '16px' }
const h1Style = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 400, color: '#3D3530', marginBottom: '12px', textAlign: 'center' }
const subtitleStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#6B5E54', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6, textAlign: 'center' }
const sectionStyle = { marginBottom: '40px' }
const h2Style = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', fontWeight: 400, color: '#3D3530', marginBottom: '20px' }

const reqCardStyle = {
  display: 'flex', gap: '14px', padding: '18px 20px',
  background: 'white', border: '1px solid #D4C8BA', borderRadius: '10px',
  marginBottom: '12px',
}
const checkStyle = {
  width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%',
  background: '#B8976A', color: 'white', display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontSize: '14px', fontWeight: 600, marginTop: '2px',
}
const reqTitleStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: '#3D3530', marginBottom: '4px' }
const reqDescStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B5E54', lineHeight: 1.6, margin: 0 }

const highlightBoxStyle = {
  padding: '20px 24px', background: '#FDF8F0', border: '1px solid #E8DFD5',
  borderRadius: '10px',
}

const deviceCardStyle = {
  display: 'flex', gap: '16px', alignItems: 'center',
  padding: '18px 20px', background: 'white', border: '1px solid #D4C8BA',
  borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s ease',
  cursor: 'pointer',
}
const priceTagStyle = {
  fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600,
  color: '#B8976A', background: '#FDF8F0', padding: '2px 8px', borderRadius: '4px',
}
const bestValueStyle = {
  fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600,
  color: 'white', background: '#6B8B4A', padding: '2px 8px', borderRadius: '4px',
  textTransform: 'uppercase', letterSpacing: '0.5px',
}
const arrowStyle = {
  fontFamily: "'DM Sans', sans-serif", fontSize: '18px', color: '#B8976A', fontWeight: 300,
}

const ctaBtnStyle = {
  display: 'inline-block', padding: '14px 28px', background: '#B8976A',
  color: 'white', borderRadius: '8px', textDecoration: 'none',
  fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500,
}
const secondaryBtnStyle = {
  display: 'inline-block', padding: '14px 28px', background: 'white',
  color: '#3D3530', border: '1px solid #D4C8BA', borderRadius: '8px',
  textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500,
}
