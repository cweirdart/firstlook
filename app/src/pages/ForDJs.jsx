import { Link } from 'react-router-dom'
import { usePageMeta } from '../utils/pageMeta'

/**
 * SEO page targeting wedding DJs and MCs.
 *
 * Target queries:
 * - "wedding DJ photo slideshow setup"
 * - "wedding DJ reception entertainment ideas"
 * - "how to run a photo slideshow at a wedding"
 * - "wedding MC duties reception"
 * - "DJ setup for wedding reception slideshow"
 * - "wedding entertainment ideas 2026"
 * - "best wedding DJ add-on services"
 * - "wedding DJ upsell photo booth alternative"
 */
export default function ForDJs() {
  usePageMeta(
    'Live Photo Slideshow for Wedding DJs',
    'Add a live guest photo slideshow to your DJ setup in 2 minutes. Better than a photo booth — $99 cost, mark up to $150-250. Runs on your existing screen, hands-free all night.'
  )
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={brandStyle}>First Look</p>
          </Link>
          <h1 style={h1Style}>For Wedding DJs & MCs</h1>
          <p style={subtitleStyle}>
            Add a live photo slideshow to your reception setup in 2 minutes. Guests upload photos from their phones, and they appear on screen in real time. It runs hands-free — you stay focused on the music.
          </p>
        </div>

        {/* Why DJs love it */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Why DJs Add First Look to Their Setup</h2>

          {[
            {
              title: 'It replaces the photo booth (and saves your clients money)',
              desc: 'Photo booths cost $500-2000, take up space, need an attendant, and only capture guests who walk over. First Look costs $99, runs on any screen, reaches every guest at their table via QR code, and you can set it up in the time it takes to plug in a mic.',
            },
            {
              title: 'It runs completely hands-free',
              desc: 'Open one URL on a screen — venue TV, projector laptop, iPad on a stand, or Fire Stick. That\'s it. Photos appear automatically as guests upload. No advancing slides, no refresh button, no babysitting. You\'re DJing, not tech support.',
            },
            {
              title: 'It adds energy to the room',
              desc: 'When guest photos start appearing on screen in real time, the whole room engages. People point, laugh, cheer. It creates a shared experience between songs, during dinner, and throughout the night. It\'s like a real-time highlight reel of the party.',
            },
            {
              title: 'It\'s a premium add-on for your packages',
              desc: 'Offer First Look as part of your DJ package. You purchase at $99 per event and mark it up to $150-250 as a "live photo experience" add-on. Your clients get more value, you get additional revenue, and the setup is trivial.',
            },
            {
              title: 'You\'re already the AV person',
              desc: 'You\'re running the sound system. You probably already have a screen for montage videos or lyrics. Adding a slideshow URL to that setup takes 30 seconds. You\'re the natural person to handle this — and now you can get paid for it.',
            },
          ].map(item => (
            <div key={item.title} style={featureCardStyle}>
              <h3 style={h3Style}>{item.title}</h3>
              <p style={{ ...bodyStyle, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Setup */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>DJ Setup Guide</h2>
          <p style={bodyStyle}>
            The couple or wedding planner will send you a setup guide link. Here's what you do:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {[
              'Open the TV Display link on whatever screen you\'re using (projector, TV, monitor, iPad)',
              'Place QR code table signs on each guest table (the couple usually prints these)',
              'Test it: scan the QR code yourself and upload a test photo — confirm it appears on screen',
              'You\'re done. The slideshow auto-advances and runs all night without input.',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={stepNumStyle}>{i + 1}</span>
                <p style={{ ...bodyStyle, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={tipBoxStyle}>
            <strong>Pro tip:</strong> If you're running a montage video during dinner, switch to the First Look slideshow URL after the montage ends. Or use a second screen — one for visuals, one for the live photo feed. The slideshow link and the TV display link are different views optimized for different setups.
          </div>
        </section>

        {/* Package integration */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>How to Add It to Your DJ Packages</h2>

          <div style={comparisonStyle}>
            <div style={compColStyle}>
              <h3 style={{ ...h3Style, color: '#9C8F87', marginBottom: '12px' }}>Your Current Package</h3>
              <p style={{ ...bodyStyle, margin: 0 }}>
                Sound system, lighting, MC duties, music coordination, montage video setup
              </p>
            </div>
            <div style={{ ...compColStyle, border: '2px solid #B8976A' }}>
              <h3 style={{ ...h3Style, color: '#B8976A', marginBottom: '12px' }}>Premium Package (add $150-250)</h3>
              <p style={{ ...bodyStyle, margin: 0 }}>
                Everything above + live guest photo slideshow. "Real-time photo experience where guests share photos from their phones and they appear on the big screen throughout the night."
              </p>
            </div>
          </div>

          <p style={{ ...bodyStyle, marginTop: '16px' }}>
            Your cost is $99 per event. The markup is yours. Most DJs charge $150-250 for the add-on, positioning it as a "live photo experience" or "interactive guest slideshow." It's less expensive and less hassle than a photo booth, and guests engage more.
          </p>
        </section>

        {/* vs photo booth */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>First Look vs. Photo Booth (for DJs)</h2>
          <div style={comparisonStyle}>
            <div style={compColStyle}>
              <h3 style={{ ...h3Style, color: '#B8976A', marginBottom: '16px' }}>First Look</h3>
              {[
                '$99 your cost, mark up freely',
                'Setup: 2 minutes',
                'Runs on your existing screen',
                'No attendant (it\'s you, hands-free)',
                'Every guest participates',
                'Unlimited photos',
                'No extra floor space',
              ].map(item => (
                <p key={item} style={compItemStyle}><span style={{ color: '#6B8B4A', marginRight: '8px' }}>✓</span>{item}</p>
              ))}
            </div>
            <div style={{ ...compColStyle, background: '#F9F6F3' }}>
              <h3 style={{ ...h3Style, color: '#9C8F87', marginBottom: '16px' }}>Photo Booth Rental</h3>
              {[
                '$500-2000 rental cost',
                'Setup: 30-60 minutes',
                'Needs its own space + backdrop',
                'Needs a dedicated attendant',
                'Only guests who walk over',
                'Limited by session time',
                'Requires 6x8ft floor space',
              ].map(item => (
                <p key={item} style={compItemStyle}><span style={{ color: '#C87F5A', marginRight: '8px' }}>✕</span>{item}</p>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Questions from DJs</h2>
          {[
            {
              q: 'Can I run the slideshow on my projector while playing music?',
              a: 'Yes. The slideshow runs in a browser tab. If your projector is connected to a laptop, just open the slideshow URL in a new tab. It auto-advances and runs silently — no audio conflict with your music.',
            },
            {
              q: 'What if the couple already has a photo booth?',
              a: 'First Look complements a photo booth. The booth gives guests printed strips; the slideshow gives the couple a real-time shared experience and collects every candid phone photo. They can run simultaneously.',
            },
            {
              q: 'Do I need to create an account?',
              a: 'No. The couple sends you a setup guide link with everything. You just open the slideshow URL on a screen and place QR signs. No account, no password, no app.',
            },
            {
              q: 'What if the venue WiFi drops?',
              a: 'Keep a mobile hotspot ready. Connect the display screen to your hotspot. Guests can use venue WiFi or cell data to upload. The slideshow will pick right back up once the connection is restored — no photos are lost.',
            },
            {
              q: 'Can I use this for other events like corporate parties or birthdays?',
              a: 'Yes. First Look works for any event where people have phones. Corporate events, birthday parties, anniversaries, fundraisers — anywhere you want live guest photo sharing on a screen.',
            },
            {
              q: 'Can I brand the slideshow with my DJ business name?',
              a: 'The slideshow currently shows the couple\'s album name and the First Look branding. Custom branding for DJs and event companies is something we\'re exploring — contact hello@firstlook.love to express interest.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={faqItemStyle}>
              <h3 style={faqQStyle}>{q}</h3>
              <p style={faqAStyle}>{a}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px 0 32px', borderTop: '1px solid #E8DFD5' }}>
          <h2 style={{ ...h2Style, textAlign: 'center' }}>Add a live photo slideshow to your next gig</h2>
          <p style={{ ...subtitleStyle, marginBottom: '24px' }}>
            $99 per event. Mark it up and offer it as a premium add-on to every wedding package.
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
                  name: 'How do wedding DJs set up a live photo slideshow?',
                  acceptedAnswer: { '@type': 'Answer', text: 'The couple sends a setup link from First Look (firstlook.love). The DJ opens the slideshow URL on their projector, TV, or any screen with a browser. QR code signs go on guest tables. Guests scan and upload photos from their phones, and photos appear on screen in real time. Setup takes about 2 minutes and runs hands-free all night.' },
                },
                {
                  '@type': 'Question',
                  name: 'Is a live photo slideshow better than a photo booth for weddings?',
                  acceptedAnswer: { '@type': 'Answer', text: 'For most weddings, yes. Photo booths cost $500-2000, need space and an attendant, and only capture guests who walk over. First Look costs $99, runs on any existing screen, reaches every guest via QR code, and runs hands-free. DJs can add it to their packages as a premium add-on for $150-250.' },
                },
                {
                  '@type': 'Question',
                  name: 'Can wedding DJs offer photo sharing as an add-on service?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. Many DJs purchase First Look at $99 per event and include it in their premium packages at a markup of $150-250. It positions as a "live photo experience" or "interactive guest slideshow." The DJ handles the simple 2-minute setup as part of their existing AV work, adding value with minimal extra effort.' },
                },
                {
                  '@type': 'Question',
                  name: 'What equipment does a DJ need for a wedding photo slideshow?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Any screen with a web browser: the projector or TV the DJ already uses for montage videos, an iPad on a stand, or an Amazon Fire Stick ($30) plugged into any HDMI TV. First Look runs entirely in the browser. If the DJ already has a screen setup, no additional equipment is needed.' },
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
const subtitleStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#6B5E54', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6, textAlign: 'center' }
const sectionStyle = { marginBottom: '40px' }
const h2Style = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '26px', fontWeight: 400, color: '#3D3530', marginBottom: '16px' }
const h3Style = { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: '#3D3530', marginBottom: '6px' }
const bodyStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B5E54', lineHeight: 1.7, marginBottom: '12px' }
const featureCardStyle = { padding: '20px', background: 'white', border: '1px solid #D4C8BA', borderRadius: '10px', marginBottom: '12px' }
const tipBoxStyle = { marginTop: '16px', padding: '14px 16px', background: '#FDF8F0', border: '1px solid #E8DFD5', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5E54', lineHeight: 1.5 }
const comparisonStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }
const compColStyle = { padding: '20px', background: 'white', border: '1px solid #D4C8BA', borderRadius: '10px' }
const compItemStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#3D3530', margin: '0 0 8px', display: 'flex', alignItems: 'center' }
const stepNumStyle = { width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', background: '#B8976A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600 }
const faqItemStyle = { padding: '16px 0', borderBottom: '1px solid #E8DFD5' }
const faqQStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#3D3530', marginBottom: '6px' }
const faqAStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5E54', lineHeight: 1.6, margin: 0 }
const ctaBtnStyle = { display: 'inline-block', padding: '14px 28px', background: '#B8976A', color: 'white', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500 }
const secondaryBtnStyle = { display: 'inline-block', padding: '14px 28px', background: 'white', color: '#3D3530', border: '1px solid #D4C8BA', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500 }
