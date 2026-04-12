import { Link } from 'react-router-dom'

/**
 * SEO page targeting wedding photographers.
 *
 * Target queries:
 * - "wedding photo delivery service"
 * - "how to share wedding photos with guests"
 * - "wedding photographer guest photo collection"
 * - "complement professional wedding photography"
 * - "wedding photographer recommend photo sharing app"
 * - "guest photos vs professional wedding photos"
 * - "QR code photo sharing for wedding photographers"
 */
export default function ForPhotographers() {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={brandStyle}>First Look</p>
          </Link>
          <h1 style={h1Style}>For Wedding Photographers</h1>
          <p style={subtitleStyle}>
            First Look doesn't replace you — it captures what you can't. The candid phone shots from every table, every angle, every moment you weren't pointed at. Recommend it to your clients as a complement to your work.
          </p>
        </div>

        {/* Why photographers love it */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Why Photographers Recommend First Look</h2>

          {[
            {
              title: 'You can\'t be everywhere',
              desc: 'You\'re shooting the first dance while Grandma is making a toast at table 12. You\'re getting the couple\'s portraits while the groomsmen are doing something hilarious at the bar. Guest phones capture the moments you physically can\'t. First Look collects all of those automatically.',
            },
            {
              title: 'It makes your clients happier',
              desc: 'Couples always say "I wish I could see the wedding from every angle." Professional photos + 200 guest phone photos means they get the polished shots AND the raw, candid moments. More photos = happier clients = more referrals for you.',
            },
            {
              title: 'It doesn\'t compete with your work',
              desc: 'Guest phone photos are candid snapshots — they complement professional photography, not replace it. Nobody is going to print a blurry phone photo on their wall. But they will laugh at Uncle Mike\'s selfie with the flower girl. Different value, different purpose.',
            },
            {
              title: 'Zero effort for you',
              desc: 'You don\'t set it up, manage it, or deliver the photos. The couple (or their wedding party) handles everything. You can mention it in your pre-wedding checklist as a recommendation. Some photographers include it in their packages as an add-on.',
            },
            {
              title: 'The live slideshow makes your reception shots better',
              desc: 'When the slideshow is running during the reception, guests are engaged, laughing, pointing at the screen. That energy creates better candid moments for you to photograph. It adds life to the room.',
            },
          ].map(item => (
            <div key={item.title} style={featureCardStyle}>
              <h3 style={h3Style}>{item.title}</h3>
              <p style={{ ...bodyStyle, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </section>

        {/* How to recommend */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>How to Recommend It to Clients</h2>
          <div style={highlightBoxStyle}>
            <p style={{ ...bodyStyle, margin: '0 0 12px' }}>
              <strong>In your pre-wedding guide or checklist:</strong>
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5E54', lineHeight: 1.7, margin: 0, fontStyle: 'italic', padding: '12px 16px', background: 'white', borderRadius: '8px', border: '1px solid #E8DFD5' }}>
              "Want to collect all the candid phone photos from your guests? Check out First Look (firstlook.love) — guests scan a QR code on their table and photos appear on a live slideshow during the reception. It's $99 and takes 5 minutes to set up. It's a great complement to your professional photos."
            </p>
          </div>
          <p style={bodyStyle}>
            Some photographers include First Look in their packages and add a small markup. Others just recommend it as a nice-to-have. Either way, your clients will appreciate the suggestion.
          </p>
        </section>

        {/* Professional vs guest photos */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Professional Photos vs. Guest Photos</h2>
          <div style={comparisonStyle}>
            <div style={compColStyle}>
              <h3 style={{ ...h3Style, color: '#B8976A', marginBottom: '16px' }}>Your Professional Photos</h3>
              {[
                'Composed, lit, edited',
                'The couple\'s hero shots',
                'Ceremony & formal portraits',
                'Print and album quality',
                'Delivered in weeks',
              ].map(item => (
                <p key={item} style={compItemStyle}><span style={{ color: '#B8976A', marginRight: '8px' }}>◆</span>{item}</p>
              ))}
            </div>
            <div style={{ ...compColStyle, background: '#F9F6F3' }}>
              <h3 style={{ ...h3Style, color: '#6B8B4A', marginBottom: '16px' }}>Guest Phone Photos</h3>
              {[
                'Raw, candid, spontaneous',
                'Every angle, every table',
                'Behind-the-scenes moments',
                'Emotional and funny',
                'Available during the event',
              ].map(item => (
                <p key={item} style={compItemStyle}><span style={{ color: '#6B8B4A', marginRight: '8px' }}>◆</span>{item}</p>
              ))}
            </div>
          </div>
          <p style={{ ...bodyStyle, textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
            Together, they tell the complete story of the wedding day.
          </p>
        </section>

        {/* FAQ */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Questions from Photographers</h2>
          {[
            {
              q: 'Will this make guests think they don\'t need a photographer?',
              a: 'No. Phone photos and professional photography serve completely different purposes. Guest photos are candid snapshots — nobody is going to print them on canvas or put them in a wedding album. They capture the raw, unposed moments that complement your polished work.',
            },
            {
              q: 'Can I include First Look in my photography packages?',
              a: 'Absolutely. Some photographers add First Look to their packages as a premium add-on. You purchase it at $99 and can mark it up however you like. It adds value to your offering without any extra work for you.',
            },
            {
              q: 'Does First Look affect the reception lighting or setup?',
              a: 'The slideshow runs on whatever screen is available — usually a venue TV or laptop/projector that\'s already set up for speeches or a video montage. It doesn\'t require special lighting, extra space, or any changes to your shooting conditions.',
            },
            {
              q: 'Can I access the guest photos for my editing?',
              a: 'The couple can share their album with you or download all guest photos as a ZIP. Some photographers include a few of the best guest photos in the final gallery as bonus candids.',
            },
            {
              q: 'What if guests are on their phones during the ceremony?',
              a: 'First Look is designed for the reception, not the ceremony. The QR codes go on reception tables. Most couples already ask guests to put phones away during the ceremony — that doesn\'t change with First Look.',
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
          <h2 style={{ ...h2Style, textAlign: 'center' }}>Add First Look to your toolkit</h2>
          <p style={{ ...subtitleStyle, marginBottom: '24px' }}>
            $99 per event. No subscription. A great recommendation for every couple you work with.
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
                  name: 'Should wedding photographers recommend a guest photo sharing app?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. Guest phone photos complement professional photography — they capture candid, raw moments from every table and angle that the photographer can\'t be at simultaneously. First Look (firstlook.love) collects guest photos via QR code and displays them on a live slideshow during the reception. It costs $99, requires no effort from the photographer, and makes couples happier with more complete coverage of their day.' },
                },
                {
                  '@type': 'Question',
                  name: 'Does guest photo sharing replace a wedding photographer?',
                  acceptedAnswer: { '@type': 'Answer', text: 'No. Guest phone photos are candid snapshots that complement professional photography, not replace it. Professional photos are composed, lit, and edited for print and album quality. Guest photos capture the raw, spontaneous moments from every angle. Together they tell the complete story of the wedding day.' },
                },
                {
                  '@type': 'Question',
                  name: 'Can wedding photographers include First Look in their packages?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. Many photographers add First Look to their packages as a premium add-on. Purchase at $99 per event and mark it up as you like. It adds value with zero extra work — the couple or wedding party handles setup. Some photographers also include the best guest candids in their final gallery delivery.' },
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
const highlightBoxStyle = { padding: '20px 24px', background: '#FDF8F0', border: '1px solid #E8DFD5', borderRadius: '10px', marginBottom: '16px' }
const comparisonStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }
const compColStyle = { padding: '20px', background: 'white', border: '1px solid #D4C8BA', borderRadius: '10px' }
const compItemStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#3D3530', margin: '0 0 8px', display: 'flex', alignItems: 'center' }
const faqItemStyle = { padding: '16px 0', borderBottom: '1px solid #E8DFD5' }
const faqQStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#3D3530', marginBottom: '6px' }
const faqAStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B5E54', lineHeight: 1.6, margin: 0 }
const ctaBtnStyle = { display: 'inline-block', padding: '14px 28px', background: '#B8976A', color: 'white', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500 }
const secondaryBtnStyle = { display: 'inline-block', padding: '14px 28px', background: 'white', color: '#3D3530', border: '1px solid #D4C8BA', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500 }
