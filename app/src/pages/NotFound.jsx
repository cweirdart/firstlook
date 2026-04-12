import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/pageMeta';

const NotFound = () => {
  usePageMeta('Page Not Found', 'This page doesn\'t exist. Browse First Look\'s wedding photo sharing features, guides, and free tools.');

  return (
    <div className="not-found-page">
      <style>{`
        .not-found-page {
          --bg-primary: #FBF9F6;
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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }

        .not-found-code {
          font-family: var(--font-display);
          font-size: 6rem;
          font-weight: 300;
          color: var(--border);
          line-height: 1;
          margin-bottom: 8px;
        }

        .not-found-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .not-found-description {
          color: var(--text-secondary);
          font-size: 0.95rem;
          max-width: 400px;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .not-found-link {
          display: inline-block;
          padding: 14px 32px;
          background: var(--accent);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
        }

        .not-found-link:hover {
          background: var(--accent-dark);
          transform: translateY(-1px);
        }

        .not-found-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          max-width: 500px;
          margin-top: 32px;
        }

        .not-found-nav a {
          padding: 8px 14px;
          border: 1px solid var(--border);
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          color: var(--text-secondary);
          transition: all 0.15s ease;
          background: white;
        }

        .not-found-nav a:hover {
          border-color: var(--accent);
          color: var(--accent-dark);
        }

        .not-found-divider {
          width: 60px;
          height: 1px;
          background: var(--border);
          margin: 24px auto;
        }

        .not-found-logo {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--text-muted);
          margin-top: 16px;
        }
      `}</style>

      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Page Not Found</h1>
      <p className="not-found-description">
        Looks like this page wandered off before the ceremony.
        Let's get you back on track.
      </p>
      <Link to="/" className="not-found-link">Back to First Look</Link>

      <div className="not-found-divider" />

      <p style={{ color: '#9C8F87', fontSize: '13px', marginBottom: '12px' }}>Or explore:</p>
      <div className="not-found-nav">
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/what-you-need">What You Need</Link>
        <Link to="/for-planners">For Planners</Link>
        <Link to="/for-wedding-party">For the Wedding Party</Link>
        <Link to="/for-photographers">For Photographers</Link>
        <Link to="/for-djs">For DJs</Link>
        <Link to="/tools/colors">Color Palette Generator</Link>
        <Link to="/checkout">Get First Look — $99</Link>
      </div>

      <p className="not-found-logo">First Look</p>
    </div>
  );
};

export default NotFound;
