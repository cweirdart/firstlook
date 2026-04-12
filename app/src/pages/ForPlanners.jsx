import { Link } from 'react-router-dom'
import { usePageMeta } from '../utils/pageMeta'

/**
 * SEO page targeting wedding planners, coordinators, and venue managers.
 *
 * Target queries:
 * - "wedding photo sharing tool for clients"
 * - "best wedding tech for planners"
 * - "QR code photo booth alternative"
 * - "wedding reception slideshow service"
 * - "recommend wedding photo app to clients"
 * - "wedding coordinator photo sharing setup"
 */
export default function ForPlanners() {
  usePageMeta(
    'First Look for Wedding Planners & Coordinators',
    'Why wedding planners recommend First Look over photo booths. $99 per event, 5-minute setup, works with any venue. Comparison grid, setup instructions, and FAQ for wedding professionals.'
  )
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={brandStyle}>First Look</p>
          </Link>
          <h1 style={h1Style}>For Wedding Planners & Coordinators</h1>
          <p style={subtitleStyle}>
            Give your clients a live photo experience at their reception without the hassle of a photo booth. First Look takes 5 minutes to set up, runs hands-free, and your clients will love it.
          </p>
        </div>

        {/* Why planners love it */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Why Planners Recommend First Look</h2>

          {[
            {
              title: 'No photo booth logistics',
              desc: 'Photo booths need space, power, an attendant, and cost $500-2000. First Look runs on the venue\'s existing TV or a $30 Fire Stick. No extra vendor, no extra setup, no extra cost for you.',
            },
            {
              title: 'Guests actually use it',
              desc: 'Photo booths create a line. QR codes on tables reach every single guest without them leaving their seat. They scan with their phone camera — no app download, no account, no friction. Upload rates are dramatically higher than any photo booth.',
            },
            {
              title: 'The live slideshow is a showstopper',
              desc: 'Photos appear on the reception display in real time as guests upload them. It creates a shared experience — everyone watches each other\'s photos appear live. It\'s the most talked-about feature at every reception.',
            },
            {
              title: '5-minute setup, zero management',
              desc: 'You or the DJ open one URL on the display screen. Put QR code signs on the tables. That\'s the entire setup. It runs automatically the rest of the night. No attendant, no troubleshooting, no babysitting.',
            },
            {
              title: 'Your clients get every photo',
              desc: 'After the event, the couple logs in and downloads every guest photo. No chasing people for uploads. No shared album links that get ignored. Every photo from every angle, automatically collected.',
            },
          ].map(item => (
            <div key={item.title} style={featureCardStyle}>
              <h3 style={h3Style}>{item.title}</h3>
              <p style={bodyStyle}>{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Comparison */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>First Look vs. Photo Booth</h2>
          <div style={comparisonStyle}>
            <div style={compColStyle}>
              <h3 style={{ ...h3Style, color: '#B8976A', marginBottom: '16px' }}>First Look</h3>
              {[
                '$99 one-time',
                'Every guest participates from their seat',
                'Live slideshow on any screen',
                'No attendant needed',
                'Unlimited photos',
                'Setup: 5 minutes',
                'Space: zero — uses existing TV',
                'Photos delivered digitally',
              ].map(item => (
                <p key={item} style={compItemStyle}><span style={{ color: '#6B8B4A', marginRight: '8px' }}>✓</span>{item}</p>
              ))}
            </div>
            <div style={{ ...compColStyle, background: '#F9F6F3' }}>
              <h3 style={{ ...h3Style, color: '#9C8F87', marginBottom: '16px' }}>Traditional Photo Booth</h3>
              {[
                '$500-2000 rental',
                'Only guests who walk over',
                'No live slideshow',
                'Needs an attendant',
                'Limited by session time',
                'Setup: 30-60 minutes',
                'Space: 6x8ft minimum',
                'Printed strips (often lost)',
              ].map(item => (
                <p key={item} style={compItemStyle}><span style={{ color: '#C87F5A', marginRight: '8px' }}>✕</span>{item}</p>
              ))}
            </div>
          </div>
        </section>

        {/* How to set it up */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Setup for Coordinators</h2>
          <p style={bodyStyle}>
            As the planner or day-of coordinator, you can handle the entire setup yourself in about 5 minutes:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {[
              'Open the TV Display link on the venue screen (smart TV, Fire Stick, laptop + projector, or iPad)',
              'Place QR code table signs on each guest table (print from the built-in sign generator)',
              'Optionally share the upload link via text or the couple\'s wedding website',
              'That\'s it — the slideshow runs automatically all night',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={stepNumStyle}>{i + 1}</span>
                <p style={{ ...bodyStyle, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Questions from Planners</h2>
          {[
            {
              q: 'Can I set this up for multiple clients?',
              a: 'Yes. Each wedding gets its own album with its own QR code and slideshow link. You can manage multiple events from one account.',
            },
            {
              q: 'Do you offer bulk pricing for planners?',
              a: 'We\'re rolling out planner packages soon. For now, each event is $99. Contact us at hello@firstlook.love to discuss volume pricing.',
            },
            {
              q: 'What if the venue doesn\'t have WiFi?',
              a: 'A mobile hotspot works. Most smartphones can create a hotspot that the display device and guests connect to. Alternatively, many DJs have portable WiFi.',
            },
            {
              q: 'Can my client moderate which photos appear on the slideshow?',
              a: 'Yes. First Look has built-in photo moderation. When enabled, uploaded photos go to a pending queue and only appear on the slideshow after the couple (or you) approve them.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={faqItemStyle}>
              <h3 style={faqQStyle}>{q}</h3>
              <p style={faqAStyle}>{a}</p>
            </div>
          ))}
        </section>

        {/* Related pages */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>More Resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/how-it-works', label: 'How First Look Works', desc: 'Detailed walkthrough for couples' },
              { to: '/for-wedding-party', label: 'For the Wedding Party', desc: 'Setup guide for the best man, maid of honor, and bridesmaids' },
              { to: '/for-djs', label: 'For DJs', desc: 'How DJs add the slideshow to their packages' },
              { to: '/what-you-need', label: 'What You Need', desc: 'Equipment checklist and display device recommendations' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={crossLinkStyle}>
                <div>
                  <strong style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#3D3530' }}>{link.label}</strong>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9C8F87', margin: '4px 0 0' }}>{link.desc}</p>
                </div>
                <span style={{ color: '#B8976A', fontSize: '18px', fontWeight: 300 }}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px 0 32px', borderTop: '1px solid #E8DFD5' }}>
          <h2 style={{ ...h2Style, textAlign: 'center' }}>Add First Look to your next event</h2>
          <p style={{ ...subtitleStyle, marginBottom: '24px' }}>
            $99 per event. No subscription. No extra vendors. Your clients will love it.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/checkout" style={ctaBtnStyle}>Get First Look — $99</Link>
            <a href="mailto:hello@firstlook.love" style={secondaryBtnStyle}>Contact for Volume Pricing</a>
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is the best photo sharing tool for wedding planners?',
                  acceptedAnswer: { '@type': 'Answer', text: 'First Look (firstlook.love) is designed for wedding planners and coordinators. It replaces photo booths with a QR code system where guests upload photos from their phones. Photos appear on a live slideshow during the reception. It costs $99 per event, takes 5 minutes to set up, and runs hands-free. No extra vendors or equipment needed.' },
                },
                {
                  '@type': 'Question',
                  name: 'Is First Look better than a photo booth for weddings?',
                  acceptedAnswer: { '@type': 'Answer', text: 'For most weddings, yes. Photo booths cost $500-2000, require space and an attendant, and only capture guests who walk over. First Look costs $99, runs on any screen, reaches every guest at their table via QR code, and creates a live slideshow. Upload rates are dramatically higher because there is zero friction — guests just scan and upload from their phone.' },
                },
                {
                  '@type': 'Question',
                  name: 'How do wedding coordinators set up First Look at a venue?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Open the TV Display URL on any screen at the venue (smart TV, Fire Stick, laptop + projector, or iPad). Place the QR code table signs on each guest table. The slideshow runs automatically — no attendant needed. Total setup time is about 5 minutes.' },
                },
              ],
            }),
          }}
        />

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

const pageStyle = { minHeight: '100vh', background: '#FBF9F6', padding: '20px' }
const containerStyle = { maxWidth: '680px', margin: '0 auto', padding: '40px 0' }
const brandStyle = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: '#B8976A', marginBottom: '16px' }
const h1Style = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 400, color: '#3D3530', marginBottom: '12px', textAlign: 'center' }
const subtitleStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#6B5E54', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6, textAlign: 'center' }
const sectionStyle = { marginBottom: '40px' }
const h2Style = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '26px', fontWeight: 400, color: '#3D3530', marginBottom: '16px' }
const h3Style = { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: '#3D3530', marginBottom: '6px' }
const bodyStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B5E54', lineHeight: 1.7, marginBottom: '8px' }
const featureCardStyle = { padding: '20px', background: 'white', border: '1px solid #D4C8BA', borderRadius: '10px', marginBottom: '12px' }
const stepNumStyle = { width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', background: '#B8976A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600 }
const comparisonStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }
const compColStyle = { padding: '20px', background: 'white', border: '1px solid #D4C8BA', borderRadius: '10px' }
const compItemStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#3D3530', margin: '0 0 8px', display: 'flex', alignItems: 'center' }
const faqItemStyle = { padding: '16px 0', borderBottom: '1px solid #E8DFD5' }
const faqQStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#3D3530', marginBottom: '6px' }
const faqAStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5E54', lineHeight: 1.6, margin: 0 }
const crossLinkStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'white', border: '1px solid #D4C8BA', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s ease', gap: '12px' }
const ctaBtnStyle = { display: 'inline-block', padding: '14px 28px', background: '#B8976A', color: 'white', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500 }
const secondaryBtnStyle = { display: 'inline-block', padding: '14px 28px', background: 'white', color: '#3D3530', border: '1px solid #D4C8BA', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500 }
