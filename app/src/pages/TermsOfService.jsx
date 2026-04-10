import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <style>{`
        .legal-page {
          --bg-primary: #FBF9F6;
          --bg-secondary: #F3EDE4;
          --accent: #B8976A;
          --accent-dark: #96784F;
          --text-primary: #3D3530;
          --text-secondary: #6B5E56;
          --text-muted: #9C8F87;
          --border: #D4C8BA;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

          min-height: 100vh;
          background: var(--bg-primary);
          font-family: var(--font-body);
          color: var(--text-primary);
        }

        .legal-header {
          padding: 24px 32px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .legal-logo {
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--text-primary);
          text-decoration: none;
        }

        .legal-back {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
        }

        .legal-back:hover { color: var(--accent-dark); }

        .legal-content {
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .legal-content h1 {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 400;
          margin-bottom: 8px;
        }

        .legal-date {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 40px;
        }

        .legal-content h2 {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 500;
          margin-top: 36px;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .legal-content p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .legal-content a {
          color: var(--accent-dark);
          text-decoration: underline;
        }

        .legal-content a:hover {
          color: var(--accent);
        }

        .legal-footer {
          text-align: center;
          padding: 32px 24px;
          border-top: 1px solid var(--border);
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>

      <header className="legal-header">
        <Link to="/" className="legal-logo">First Look</Link>
        <Link to="/" className="legal-back">← Back to Home</Link>
      </header>

      <div className="legal-content">
        <h1>Terms of Service</h1>
        <p className="legal-date">Effective date: April 9, 2026</p>

        <p>
          Welcome to First Look. By using our website at firstlook.love and our photo sharing
          service, you agree to these Terms of Service. Please read them carefully.
        </p>

        <h2>The Service</h2>
        <p>
          First Look provides a private photo sharing platform for weddings and events. Account
          holders can create photo albums, generate QR codes for guest uploads, view photos in
          slideshows, and download their collected photos. Guests can upload photos without
          creating an account.
        </p>

        <h2>Accounts</h2>
        <p>
          To create albums and manage photos, you need an account. You are responsible for
          maintaining the security of your account credentials. You must be at least 18 years
          old to create an account. You agree to provide accurate information when creating
          your account.
        </p>

        <h2>Payment and Refunds</h2>
        <p>
          First Look charges a one-time fee for access to the platform. Payment is processed
          securely through Stripe. If you are unsatisfied with the service before your event
          date, contact us at hello@firstlook.love within 30 days of purchase for a full refund.
          After your event has taken place, refunds are provided at our discretion.
        </p>

        <h2>Your Content</h2>
        <p>
          You retain full ownership of all photos and messages uploaded to First Look. We do not
          claim any rights to your content. By uploading content, you grant us a limited license
          to store, display, and transmit that content solely for the purpose of providing the
          service to you and your guests. We will never use your photos for marketing, advertising,
          or any other purpose without your explicit written consent.
        </p>

        <h2>Guest Uploads</h2>
        <p>
          As an album owner, you are responsible for the content uploaded by your guests. You
          have access to photo moderation tools to approve or reject uploaded content. First Look
          is not responsible for the content guests upload to your album.
        </p>

        <h2>Acceptable Use</h2>
        <p>
          You agree not to use First Look to upload or distribute content that is illegal,
          harmful, threatening, abusive, or violates the rights of others. We reserve the right
          to remove content and terminate accounts that violate these terms.
        </p>

        <h2>Availability and Uptime</h2>
        <p>
          We strive to keep First Look available and reliable, especially during your event.
          However, we cannot guarantee 100% uptime. We are not liable for temporary service
          interruptions due to maintenance, server issues, or circumstances beyond our control.
          We recommend downloading your photos regularly as a backup.
        </p>

        <h2>Data and Privacy</h2>
        <p>
          Your privacy matters to us. Please review our{' '}
          <Link to="/privacy">Privacy Policy</Link> for details on how we collect, use, and
          protect your information.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          First Look is provided "as is" without warranties of any kind. To the maximum extent
          permitted by law, we are not liable for any indirect, incidental, or consequential
          damages arising from your use of the service, including but not limited to loss of
          photos or data. Our total liability is limited to the amount you paid for the service.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms of Service from time to time. We will notify you of significant
          changes by posting a notice on our website. Your continued use of the service after
          changes take effect constitutes acceptance of the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about these Terms of Service, contact us at{' '}
          <a href="mailto:hello@firstlook.love">hello@firstlook.love</a>.
        </p>
      </div>

      <footer className="legal-footer">
        © {new Date().getFullYear()} First Look. All rights reserved.
      </footer>
    </div>
  );
};

export default TermsOfService;
