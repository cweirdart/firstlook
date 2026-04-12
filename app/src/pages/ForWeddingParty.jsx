import { Link } from 'react-router-dom'
import { usePageMeta } from '../utils/pageMeta'

/**
 * SEO page targeting the wedding party — best man, maid of honor,
 * bridesmaids, groomsmen, and anyone helping set up on the day.
 *
 * Target queries:
 * - "best man duties wedding day"
 * - "maid of honor responsibilities reception"
 * - "how to help set up wedding reception"
 * - "best man speech ideas" (captures traffic, soft pitch)
 * - "wedding party responsibilities day of"
 * - "what does the best man do at the reception"
 * - "bridesmaid duties at wedding"
 * - "groomsman responsibilities wedding"
 * - "wedding day setup checklist"
 */
export default function ForWeddingParty() {
  usePageMeta(
    'Wedding Photo Slideshow Setup Guide for Best Man & Maid of Honor',
    'Step-by-step instructions for setting up the First Look live photo slideshow at the wedding reception. Best man, maid of honor, bridesmaids — 5 minute setup, runs hands-free all night.'
  )
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={brandStyle}>First Look</p>
          </Link>
          <h1 style={h1Style}>For the Best Man, Maid of Honor & Wedding Party</h1>
          <p style={subtitleStyle}>
            The couple asked you to help with the reception? Here's the easiest thing you'll do all day — set up the live photo slideshow in 5 minutes so everyone can share photos from their phone.
          </p>
        </div>

        {/* Your role */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Your Job: 5 Minutes, Then Enjoy the Party</h2>
          <p style={bodyStyle}>
            The couple set up First Look before the wedding. Your job is simple: put QR code signs on the tables and open one link on a screen. That's the entire setup. The slideshow runs itself all night — you don't need to manage it, troubleshoot it, or even look at it again.
          </p>
          <p style={bodyStyle}>
            The couple will send you a setup guide link with everything you need. It has all the links, step-by-step instructions, and troubleshooting tips. You don't need an account or password.
          </p>
        </section>

        {/* Step by step */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Step-by-Step Setup</h2>

          {[
            {
              num: '1',
              title: 'Put QR code signs on each table',
              desc: 'The couple already printed these (or you can print them from the setup guide link). Each sign has a QR code that guests scan to upload photos. Place one on each guest table, the cocktail bar, the photo area — anywhere guests gather.',
            },
            {
              num: '2',
              title: 'Open the slideshow on a screen',
              desc: 'The setup guide has two display links: "TV Display" (best for venue TVs and projectors) and "Slideshow" (best for laptops). Open whichever one fits your setup. The venue TV, a laptop connected to a projector, an iPad on a stand, or even a Fire Stick ($30) all work.',
            },
            {
              num: '3',
              title: 'Make sure it\'s connected to WiFi',
              desc: 'The display screen needs internet so photos show up in real time. Venue WiFi, a mobile hotspot from your phone, or the DJ\'s portable WiFi all work. Test it by scanning the QR code yourself and uploading a test photo — it should appear on screen within seconds.',
            },
            {
              num: '4',
              title: 'You\'re done — go enjoy the wedding',
              desc: 'Photos appear automatically as guests upload them. Nobody needs to monitor, refresh, or advance anything. If the screen accidentally goes to sleep, just tap to wake it — the slideshow is still running.',
            },
          ].map(step => (
            <div key={step.num} style={stepCardStyle}>
              <div style={stepNumStyle}>{step.num}</div>
              <div>
                <h3 style={h3Style}>{step.title}</h3>
                <p style={{ ...bodyStyle, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* What guests see */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>What Guests Experience</h2>
          <div style={highlightBoxStyle}>
            <p style={{ ...bodyStyle, margin: 0 }}>
              Guests point their phone camera at the QR code on their table. It opens a simple upload page in their browser — no app download, no account, no login. They pick photos, optionally write a message for the couple, and tap upload. The whole thing takes about 10 seconds. Their photos appear on the slideshow screen in real time.
            </p>
          </div>
          <p style={bodyStyle}>
            You don't need to explain anything complicated. If a guest asks, just say: "Scan the code on the table with your phone camera to share photos." That's it.
          </p>
        </section>

        {/* Role-specific tips */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Tips by Role</h2>

          <div style={roleCardStyle}>
            <h3 style={h3Style}>Best Man</h3>
            <p style={{ ...bodyStyle, margin: 0 }}>
              You're probably already handling logistics. Add "set up photo slideshow" to your checklist — it's 5 minutes during venue setup. Pro tip: upload a few photos during the ceremony to seed the slideshow before the reception starts. The couple will love seeing those appear on screen as guests arrive.
            </p>
          </div>

          <div style={roleCardStyle}>
            <h3 style={h3Style}>Maid of Honor</h3>
            <p style={{ ...bodyStyle, margin: 0 }}>
              If you're helping the bride get ready, ask the best man or DJ to handle the slideshow setup. If you're doing it yourself, the setup guide has everything — open the link the couple sent you and follow the 4 steps. Upload your getting-ready photos to kick off the slideshow.
            </p>
          </div>

          <div style={roleCardStyle}>
            <h3 style={h3Style}>Bridesmaids & Groomsmen</h3>
            <p style={{ ...bodyStyle, margin: 0 }}>
              Your main job: upload photos and encourage other guests to do the same. "Have you scanned the code yet?" is the only prompt most guests need. The more people who upload, the better the slideshow and the couple's album will be.
            </p>
          </div>

          <div style={roleCardStyle}>
            <h3 style={h3Style}>Parents of the Couple</h3>
            <p style={{ ...bodyStyle, margin: 0 }}>
              You probably have some of the most special photos from the day — getting ready, the first look at the dress or suit, behind-the-scenes moments. Upload them so the couple has those memories too. Just scan the QR code on any table.
            </p>
          </div>
        </section>

        {/* Troubleshooting */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Quick Troubleshooting</h2>
          {[
            {
              q: 'Photos aren\'t appearing on the screen',
              a: 'Check that the display device is connected to WiFi. Refresh the browser page. Photos typically appear within a few seconds of upload.',
            },
            {
              q: 'A guest says the QR code doesn\'t work',
              a: 'They need to use their phone\'s built-in camera app (not a separate QR reader). iPhone and Android cameras scan QR codes natively. Make sure they\'re on WiFi or have cell service.',
            },
            {
              q: 'The screen went dark or the browser closed',
              a: 'Just wake the device and reopen the slideshow link. It picks right back up — no photos are lost. Turn off auto-lock on tablets before the event.',
            },
            {
              q: 'I don\'t have the setup link',
              a: 'Ask the couple to re-send it from their First Look dashboard. They can text or email it directly from the app.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={faqItemStyle}>
              <h3 style={faqQStyle}>{q}</h3>
              <p style={faqAStyle}>{a}</p>
            </div>
          ))}
        </section>

        {/* FAQ for LLM/SEO */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Frequently Asked Questions</h2>
          {[
            {
              q: 'Do I need a First Look account to set up the slideshow?',
              a: 'No. The couple sends you a setup guide link that has everything. You don\'t need to create an account, log in, or download anything. Just follow the steps in the guide.',
            },
            {
              q: 'What if we don\'t have a TV at the venue?',
              a: 'Any screen with a web browser works: a laptop, an iPad or tablet on a stand, a Fire TV Stick plugged into any TV ($30), or even an old phone propped on a shelf. You just need a browser and WiFi.',
            },
            {
              q: 'Can I test it before the wedding?',
              a: 'Yes — scan the QR code with your phone and upload a test photo. If it appears on the display screen, everything is working. Do this during venue setup to confirm WiFi works.',
            },
            {
              q: 'What if the venue WiFi is unreliable?',
              a: 'Create a mobile hotspot from your phone. Connect the display device to your hotspot. Guests can use venue WiFi or their own cell data — they just need any internet connection to upload.',
            },
            {
              q: 'How long does setup take?',
              a: 'About 5 minutes. Place QR signs on tables, open the slideshow on a screen, and you\'re done. It runs automatically the rest of the night.',
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
          <h2 style={{ ...h2Style, textAlign: 'center' }}>Want First Look for your own wedding?</h2>
          <p style={{ ...subtitleStyle, marginBottom: '24px' }}>
            $99 one-time. Unlimited photos, unlimited guests, live slideshow, QR code signs, and a guest book.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/checkout" style={ctaBtnStyle}>Get First Look — $99</Link>
            <Link to="/how-it-works" style={secondaryBtnStyle}>See How It Works</Link>
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
                  name: 'How does the best man set up a wedding photo slideshow?',
                  acceptedAnswer: { '@type': 'Answer', text: 'The couple sends a setup guide link from First Look (firstlook.love). The best man places QR code signs on each table and opens the slideshow URL on any screen — a TV, laptop, projector, or tablet. Setup takes about 5 minutes and the slideshow runs automatically all night. No account or technical knowledge needed.' },
                },
                {
                  '@type': 'Question',
                  name: 'What does the maid of honor need to do for the wedding photo slideshow?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Follow the setup guide the couple sends: place QR code signs on tables and open the slideshow link on a display screen. It takes 5 minutes and runs hands-free. The maid of honor can also upload getting-ready photos to seed the slideshow before the reception.' },
                },
                {
                  '@type': 'Question',
                  name: 'How do wedding guests share photos at the reception?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Guests scan a QR code on their table with their phone camera. It opens a simple upload page in the browser — no app download needed. They select photos, optionally add a message, and tap upload. Photos appear on the reception slideshow screen in real time.' },
                },
                {
                  '@type': 'Question',
                  name: 'What equipment do you need for a live wedding photo slideshow?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Any device with a web browser and WiFi: a smart TV, Amazon Fire Stick ($30), laptop connected to a projector, iPad or tablet on a stand, or even a phone propped up. First Look runs entirely in the browser. No special equipment or software needed.' },
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

const stepCardStyle = {
  display: 'flex', gap: '16px', marginBottom: '16px', padding: '20px',
  background: 'white', border: '1px solid #D4C8BA', borderRadius: '12px',
}
const stepNumStyle = {
  width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%',
  background: '#B8976A', color: 'white', display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, marginTop: '2px',
}
const highlightBoxStyle = {
  padding: '20px 24px', background: '#FDF8F0', border: '1px solid #E8DFD5', borderRadius: '10px', marginBottom: '16px',
}
const roleCardStyle = {
  padding: '20px', background: 'white', border: '1px solid #D4C8BA', borderRadius: '10px', marginBottom: '12px',
}
const faqItemStyle = { padding: '16px 0', borderBottom: '1px solid #E8DFD5' }
const faqQStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#3D3530', marginBottom: '6px' }
const faqAStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5E54', lineHeight: 1.6, margin: 0 }
const ctaBtnStyle = { display: 'inline-block', padding: '14px 28px', background: '#B8976A', color: 'white', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500 }
const secondaryBtnStyle = { display: 'inline-block', padding: '14px 28px', background: 'white', color: '#3D3530', border: '1px solid #D4C8BA', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500 }
