import { Link } from 'react-router-dom'
import { usePageMeta } from '../utils/pageMeta'

/**
 * Guides index — the hub page that links every SEO content page.
 *
 * Purpose:
 * - Gives Google/Bing/LLM crawlers one index with all role + how-to pages in one hop
 * - Landing for organic queries like "wedding photo sharing guide" or "wedding app guides"
 * - Internal-link equity flows inward to role pages and outward from footers
 *
 * Strategy: short paragraphs with each section's keywords, link to the source pages.
 */
export default function Guides() {
  usePageMeta(
    'Wedding Photo Sharing Guides — First Look',
    'Complete guides to setting up live wedding photo sharing. For planners, photographers, DJs, wedding parties, and couples. Free guides, no signup needed.'
  )

  return (
    <div style={pageStyle}>
      {/* JSON-LD for CollectionPage/ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Wedding Photo Sharing Guides',
            description: 'Guides to setting up live wedding photo sharing for planners, photographers, DJs, wedding parties, and couples.',
            url: 'https://firstlook.love/guides',
            hasPart: [
              { '@type': 'WebPage', name: 'How It Works', url: 'https://firstlook.love/how-it-works' },
              { '@type': 'WebPage', name: 'What You Need', url: 'https://firstlook.love/what-you-need' },
              { '@type': 'WebPage', name: 'For Wedding Planners', url: 'https://firstlook.love/for-planners' },
              { '@type': 'WebPage', name: 'For the Wedding Party', url: 'https://firstlook.love/for-wedding-party' },
              { '@type': 'WebPage', name: 'For Photographers', url: 'https://firstlook.love/for-photographers' },
              { '@type': 'WebPage', name: 'For DJs', url: 'https://firstlook.love/for-djs' },
            ],
          }),
        }}
      />

      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={brandStyle}>First Look</p>
          </Link>
          <h1 style={h1Style}>Wedding Photo Sharing Guides</h1>
          <p style={subtitleStyle}>
            Everything you need to set up live photo sharing at a wedding reception. No account, no software install. Pick the guide that matches your role.
          </p>
        </div>

        <section style={gridStyle}>
          <GuideCard
            to="/how-it-works"
            eyebrow="Start here"
            title="How First Look Works"
            desc="A walkthrough of the full flow: couple creates an album, guests scan a QR code, photos appear on a live reception slideshow — all within minutes. Includes screenshots and a step-by-step timeline."
          />
          <GuideCard
            to="/what-you-need"
            eyebrow="Checklist"
            title="What You Need on Wedding Day"
            desc="The complete equipment list: what device to use for the slideshow, how big to print the QR table signs, WiFi considerations, and backup options when the venue's network is spotty."
          />
          <GuideCard
            to="/for-planners"
            eyebrow="For planners"
            title="For Wedding Planners & Coordinators"
            desc="Why coordinators recommend First Look over rented photo booths. 5-minute setup, works at any venue, $99 per event. Includes a photo booth vs QR sharing comparison and a client hand-off template."
          />
          <GuideCard
            to="/for-wedding-party"
            eyebrow="For best man / MOH"
            title="For the Best Man, Maid of Honor, & Wedding Party"
            desc="Everything the wedding party needs to set up the photo display on the day of the wedding. No tech skills required — just the setup link and the couple's WiFi password."
          />
          <GuideCard
            to="/for-photographers"
            eyebrow="For photographers"
            title="For Wedding Photographers"
            desc="How First Look fits alongside your professional gallery without competing with it. Guest photos capture the moments your camera can't be in two places for. Includes referral partner info."
          />
          <GuideCard
            to="/for-djs"
            eyebrow="For DJs"
            title="For Wedding DJs & MCs"
            desc="Use the reception slideshow as part of your lighting and mood package. Runs on any laptop, projects to venue TVs, and fills dead air with live-scrolling guest photos and toasts."
          />
        </section>

        <section style={ctaStyle}>
          <h2 style={h2Style}>Ready to set up your album?</h2>
          <p style={{ ...subtitleStyle, marginTop: '8px', marginBottom: '24px' }}>
            Create your first album for free. Upload unlimited guest photos for $99 once your wedding date is confirmed.
          </p>
          <Link to="/signup" style={primaryBtnStyle}>Create Album &rarr;</Link>
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Questions? Email <a href="mailto:hello@firstlook.love" style={{ color: 'var(--accent)' }}>hello@firstlook.love</a>
          </p>
        </section>
      </div>
    </div>
  )
}

function GuideCard({ to, eyebrow, title, desc }) {
  return (
    <Link to={to} style={cardStyle}>
      <span style={eyebrowStyle}>{eyebrow}</span>
      <h3 style={cardTitleStyle}>{title}</h3>
      <p style={cardDescStyle}>{desc}</p>
      <span style={readMoreStyle}>Read guide &rarr;</span>
    </Link>
  )
}

// ── Styles ──────────────────────────────────────────────

const pageStyle = {
  minHeight: '100vh',
  background: '#FBF9F6',
  padding: '40px 20px',
}

const containerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
}

const brandStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  color: '#B8976A',
  marginBottom: '24px',
  fontWeight: 400,
  letterSpacing: '1px',
}

const h1Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 'clamp(32px, 6vw, 48px)',
  color: '#3D3530',
  fontWeight: 400,
  marginBottom: '16px',
  lineHeight: 1.15,
}

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 'clamp(24px, 4vw, 32px)',
  color: '#3D3530',
  fontWeight: 400,
  marginBottom: '12px',
}

const subtitleStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '17px',
  color: '#6B5E54',
  lineHeight: 1.6,
  maxWidth: '580px',
  margin: '0 auto',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginBottom: '64px',
}

const cardStyle = {
  display: 'block',
  background: 'white',
  border: '1px solid #D4C8BA',
  borderRadius: '12px',
  padding: '28px',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
}

const eyebrowStyle = {
  display: 'inline-block',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '11px',
  color: '#B8976A',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontWeight: 600,
  marginBottom: '10px',
}

const cardTitleStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '22px',
  color: '#3D3530',
  fontWeight: 500,
  marginBottom: '8px',
  lineHeight: 1.25,
}

const cardDescStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  color: '#6B5E54',
  lineHeight: 1.55,
  marginBottom: '14px',
}

const readMoreStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '13px',
  color: '#B8976A',
  fontWeight: 500,
}

const ctaStyle = {
  textAlign: 'center',
  padding: '48px 24px',
  background: 'white',
  border: '1px solid #D4C8BA',
  borderRadius: '16px',
}

const primaryBtnStyle = {
  display: 'inline-block',
  padding: '14px 32px',
  background: '#B8976A',
  color: 'white',
  borderRadius: '8px',
  textDecoration: 'none',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '15px',
  fontWeight: 500,
}
