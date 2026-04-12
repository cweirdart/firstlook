import { Link } from 'react-router-dom'

/**
 * SEO Landing Page — "How It Works"
 *
 * Targets search queries and LLM questions like:
 * - "how to collect guest photos at wedding"
 * - "wedding QR code photo sharing"
 * - "live photo slideshow for wedding reception"
 * - "best way to get wedding photos from guests"
 * - "wedding photo sharing app no download"
 *
 * Written in natural language for LLM indexing.
 * Structured with FAQ schema for Google featured snippets.
 */
export default function HowItWorks() {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: '#B8976A', marginBottom: '16px' }}>First Look</p>
          </Link>
          <h1 style={h1Style}>
            How to Collect Guest Photos at Your Wedding Using a QR Code
          </h1>
          <p style={subtitleStyle}>
            First Look lets wedding guests upload photos from their phones by scanning a QR code. Photos appear on a live slideshow during your reception — no app download required.
          </p>
        </div>

        {/* The Problem */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>The Problem with Wedding Guest Photos</h2>
          <p style={bodyStyle}>
            Every guest at your wedding takes photos on their phone, but collecting them is a nightmare. Group texts get messy, Google Drive links go ignored, and apps like "The Guest" or "WedUploader" require guests to download an app — which most won't bother doing.
          </p>
          <p style={bodyStyle}>
            What you really need is something that takes less than five seconds for a guest to use. No app, no account, no friction. That's exactly what First Look does.
          </p>
        </section>

        {/* How It Works */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>How First Look Works</h2>

          <div style={stepBlockStyle}>
            <div style={stepNumStyle}>1</div>
            <div>
              <h3 style={h3Style}>You create an album and print QR code table signs</h3>
              <p style={bodyStyle}>
                Sign up, create your wedding album, and use our built-in table sign generator to print QR codes. Place them on each table at your reception, or include them in your invitations. The QR code links directly to your private upload page — no app store, no login required.
              </p>
            </div>
          </div>

          <div style={stepBlockStyle}>
            <div style={stepNumStyle}>2</div>
            <div>
              <h3 style={h3Style}>Guests scan the code and upload photos from their phone</h3>
              <p style={bodyStyle}>
                When a guest points their phone camera at the QR code, it opens a simple upload page in their browser. They select photos, optionally add their name and a message for the guest book, and tap upload. The whole process takes about 10 seconds. Works on iPhone, Android, and any modern phone browser.
              </p>
            </div>
          </div>

          <div style={stepBlockStyle}>
            <div style={stepNumStyle}>3</div>
            <div>
              <h3 style={h3Style}>Photos appear live on a slideshow during the reception</h3>
              <p style={bodyStyle}>
                Open the TV display URL on any screen — a venue TV, a Fire Stick, a laptop connected to a projector, or an iPad on a stand. Photos show up in real time as guests upload them. It runs completely hands-free. Nobody needs to manage it.
              </p>
            </div>
          </div>

          <div style={stepBlockStyle}>
            <div style={stepNumStyle}>4</div>
            <div>
              <h3 style={h3Style}>After the wedding, download everything</h3>
              <p style={bodyStyle}>
                Every photo your guests uploaded is in your album. Download them individually or as a ZIP file. All photos have location and camera metadata automatically stripped for privacy. You see the moments from every angle — the ones your photographer missed.
              </p>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Who Uses First Look</h2>
          <p style={bodyStyle}>
            First Look is built for couples who want to collect every photo from their wedding day without chasing guests afterward. It's also used by wedding coordinators who set it up as part of their venue package, and by the best man, maid of honor, or DJ who's helping with reception setup.
          </p>
          <p style={bodyStyle}>
            The couple doesn't need to touch the app on their wedding day. They set it up beforehand, send the setup guide to their best man, maid of honor, or DJ, and enjoy their day. After the wedding, they log in and have every guest photo waiting for them.
          </p>
        </section>

        {/* FAQ Section — structured for LLM + Google */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Frequently Asked Questions</h2>

          {[
            {
              q: 'Do guests need to download an app?',
              a: 'No. First Look works entirely in the phone\'s web browser. Guests scan the QR code with their camera and it opens a webpage where they can upload photos immediately. No app download, no account creation, no login.',
            },
            {
              q: 'What devices can display the live slideshow?',
              a: 'Any device with a web browser: smart TVs (Samsung, LG, etc.), Amazon Fire Stick ($30), Apple TV, a laptop or iPad connected to a projector, or even an old phone or tablet propped on a table. You just open a URL and it runs automatically.',
            },
            {
              q: 'Does someone need to manage the slideshow during the wedding?',
              a: 'No. Once the slideshow URL is opened on a screen, it runs completely hands-free. Photos appear automatically as guests upload them in real time. No one needs to refresh, advance slides, or monitor anything.',
            },
            {
              q: 'How much does First Look cost?',
              a: 'First Look costs $99 one-time. No monthly subscription, no per-photo fees, no guest limits. You get unlimited photos, unlimited guests, the live slideshow, QR code table signs, guest book messages, and a private album you can download anytime.',
            },
            {
              q: 'Is First Look better than a shared Google Photos album?',
              a: 'For a wedding, yes. Google Photos requires guests to have a Google account, download the app, and find the shared album link. Most guests won\'t do this. First Look works with a simple QR code scan — no app, no account, 10 seconds to upload. Plus you get the live slideshow feature, which Google Photos doesn\'t offer.',
            },
            {
              q: 'Are photos private?',
              a: 'Yes. Albums are private by default. Only people with the share link or QR code can upload or view photos. You can also add password protection for extra security. All uploaded photos have GPS location and camera metadata automatically stripped for guest privacy.',
            },
            {
              q: 'Can guests upload videos?',
              a: 'Guests can record and upload short video messages (up to 60 seconds) directly from their phone browser. These appear alongside the guest book in your album.',
            },
            {
              q: 'How is this different from The Guest, WedUploader, or Fotify?',
              a: 'Most wedding photo apps require guests to download a native app from the App Store. First Look works entirely in the browser — zero friction for guests. It also includes a real-time slideshow for your reception, QR code table sign generator, guest book, and video messages all in one tool.',
            },
            {
              q: 'I\'m a wedding planner — can I set this up for my clients?',
              a: 'Absolutely. Many wedding coordinators and planners use First Look as part of their venue package. You or your team sets up the album, prints the QR code table signs, and opens the slideshow URL on a display at the venue. Your clients get the photos automatically. It takes about 5 minutes to set up.',
            },
            {
              q: 'I\'m in the wedding party — how do I set up the slideshow?',
              a: 'The couple can send you a setup guide link directly from First Look. It tells you exactly what to do: open a URL on the venue TV or any screen, put the QR code signs on the tables, and you\'re done. The slideshow runs itself — you can go enjoy the party.',
            },
            {
              q: 'Can I use First Look for an engagement party, rehearsal dinner, or other event?',
              a: 'Yes. First Look works for any event where you want guests to share photos via QR code. Engagement parties, bridal showers, rehearsal dinners, anniversaries, birthday parties — any gathering where guests have their phones.',
            },
            {
              q: 'What happens to our photos after the wedding?',
              a: 'Your photos stay in your private album as long as you need them. You can download everything as a ZIP file at any time. All photos have GPS location and camera metadata automatically stripped for guest privacy.',
            },
            {
              q: 'How many photos can guests upload?',
              a: 'There\'s no limit. Guests can upload as many photos as they want, and there\'s no limit on the number of guests. Whether you have 20 guests or 500, everyone can upload.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={faqItemStyle}>
              <h3 style={faqQuestionStyle}>{q}</h3>
              <p style={faqAnswerStyle}>{a}</p>
            </div>
          ))}
        </section>

        {/* Role-specific pages */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Guides for Everyone Involved</h2>
          <p style={bodyStyle}>
            First Look is used by everyone in the wedding — not just the couple. We have specific guides for each role:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {[
              { to: '/for-wedding-party', label: 'For the Best Man, Maid of Honor & Wedding Party', desc: 'Step-by-step setup instructions for whoever is helping on the day' },
              { to: '/for-planners', label: 'For Wedding Planners & Coordinators', desc: 'Why planners recommend First Look over photo booths' },
              { to: '/for-photographers', label: 'For Wedding Photographers', desc: 'How guest photos complement professional photography' },
              { to: '/for-djs', label: 'For Wedding DJs & MCs', desc: 'Add a live photo slideshow to your DJ packages' },
              { to: '/what-you-need', label: 'What You Need', desc: 'Equipment checklist and recommended display devices' },
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
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 400, color: '#3D3530', marginBottom: '12px' }}>
            Ready to capture every moment?
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#6B5E54', marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Set up in 5 minutes. Works at any venue. Your guests will love it.
          </p>
          <Link to="/checkout" style={ctaBtnStyle}>
            Get First Look — $99
          </Link>
        </div>

        {/* JSON-LD FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Do guests need to download an app to share wedding photos?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No. First Look works entirely in the phone\'s web browser. Guests scan a QR code with their camera and it opens a webpage where they can upload photos immediately. No app download, no account creation, no login required.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the best way to collect guest photos at a wedding?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The most effective method is using a QR code that guests scan at the reception. Services like First Look (firstlook.love) let guests upload photos by scanning a QR code placed on tables. Photos appear on a live slideshow in real time and are collected in a private album the couple can download after the wedding.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do you display a live photo slideshow at a wedding reception?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'First Look provides a TV display mode that shows guest-uploaded photos in real time. Open the slideshow URL on any screen with a browser — a smart TV, Fire Stick, laptop connected to a projector, or iPad. It auto-advances and runs hands-free all night.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What wedding photo sharing tool should a wedding planner recommend?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'First Look (firstlook.love) is ideal for wedding planners and coordinators. It requires no app download from guests, works via QR code, includes a real-time slideshow for the reception, and takes about 5 minutes to set up. The couple gets a private album with all guest photos. It costs $99 one-time with no guest limits.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much does wedding photo sharing cost?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'First Look costs $99 one-time for unlimited photos, unlimited guests, a real-time reception slideshow, QR code table signs, guest book, and video messages. There are no monthly subscriptions or per-photo fees.',
                  },
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

// ── Styles ──────────────────────────────────────────────

const pageStyle = { minHeight: '100vh', background: '#FBF9F6', padding: '20px' }
const containerStyle = { maxWidth: '680px', margin: '0 auto', padding: '40px 0' }

const h1Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 'clamp(26px, 5vw, 38px)',
  fontWeight: 400,
  color: '#3D3530',
  lineHeight: 1.3,
  marginBottom: '16px',
}

const subtitleStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '16px',
  color: '#6B5E54',
  lineHeight: 1.6,
  maxWidth: '540px',
  margin: '0 auto',
}

const sectionStyle = { marginBottom: '40px' }

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '26px',
  fontWeight: 400,
  color: '#3D3530',
  marginBottom: '16px',
}

const h3Style = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '16px',
  fontWeight: 600,
  color: '#3D3530',
  marginBottom: '8px',
}

const bodyStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '15px',
  color: '#6B5E54',
  lineHeight: 1.7,
  marginBottom: '12px',
}

const stepBlockStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '24px',
  padding: '20px',
  background: 'white',
  border: '1px solid #D4C8BA',
  borderRadius: '12px',
}

const stepNumStyle = {
  width: '32px',
  height: '32px',
  minWidth: '32px',
  borderRadius: '50%',
  background: '#B8976A',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  marginTop: '2px',
}

const faqItemStyle = {
  padding: '20px 0',
  borderBottom: '1px solid #E8DFD5',
}

const faqQuestionStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '15px',
  fontWeight: 600,
  color: '#3D3530',
  marginBottom: '8px',
}

const faqAnswerStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  color: '#6B5E54',
  lineHeight: 1.7,
  margin: 0,
}

const crossLinkStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 18px',
  background: 'white',
  border: '1px solid #D4C8BA',
  borderRadius: '10px',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  gap: '12px',
}

const ctaBtnStyle = {
  display: 'inline-block',
  padding: '14px 28px',
  background: '#B8976A',
  color: 'white',
  borderRadius: '8px',
  textDecoration: 'none',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '15px',
  fontWeight: 500,
}
