import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
        <h1>Privacy Policy</h1>
        <p className="legal-date">Effective date: April 9, 2026</p>

        <p>
          First Look ("we", "us", "our") operates the website firstlook.love and provides
          a private photo sharing service for weddings and events. This Privacy Policy explains
          how we collect, use, and protect your information.
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you sign up for First Look, we collect your email address and any profile
          information you choose to provide. When guests upload photos through your album's
          QR code, we receive the photo files and optional guest names. We do not require
          guests to create accounts, provide personal information, or install any app.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use your email address to manage your account, send transactional emails
          (like purchase confirmations), and communicate important updates about the service.
          We do not send marketing emails unless you've opted in. Photos and messages uploaded
          by guests are stored solely for the purpose of your private album and are not used
          for advertising, training, or shared with third parties.
        </p>

        <h2>Photo Privacy</h2>
        <p>
          Privacy is at the core of First Look. Photos uploaded to your album are private by
          default and accessible only through your unique share link. We strip EXIF metadata
          from uploaded photos to protect guest location data. We do not analyze, scan, or
          use photo content for any purpose other than displaying it in your album.
        </p>

        <h2>Data Storage and Security</h2>
        <p>
          Your data is stored on secure servers provided by Supabase (database and authentication)
          and Vercel (hosting). All data is transmitted over HTTPS. We implement industry-standard
          security measures to protect your information, including encrypted storage and
          row-level security policies on our database.
        </p>

        <h2>Payments</h2>
        <p>
          Payments are processed by Stripe. We never see or store your credit card number,
          CVV, or billing details. Stripe's privacy policy governs the handling of your
          payment information. You can review it at{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            stripe.com/privacy
          </a>.
        </p>

        <h2>Cookies and Tracking</h2>
        <p>
          We use minimal cookies necessary for authentication and session management. We do not
          use advertising cookies, tracking pixels, or share data with ad networks. We may use
          privacy-friendly analytics (such as Plausible) that do not track individual users
          or use cookies.
        </p>

        <h2>Data Retention</h2>
        <p>
          Your photos and account data are retained for as long as your account is active.
          You can request deletion of your account and all associated data at any time by
          contacting us at hello@firstlook.love. Upon deletion, all photos, messages, and
          account information will be permanently removed within 30 days.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time.
          You can export your photos in bulk from your dashboard. If you have questions about
          your data or wish to exercise any of these rights, contact us at{' '}
          <a href="mailto:hello@firstlook.love">hello@firstlook.love</a>.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant
          changes by posting a notice on our website or sending you an email. Your continued use
          of First Look after changes take effect constitutes acceptance of the updated policy.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at{' '}
          <a href="mailto:hello@firstlook.love">hello@firstlook.love</a>.
        </p>
      </div>

      <footer className="legal-footer">
        © {new Date().getFullYear()} First Look. All rights reserved.
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
