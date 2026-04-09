import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode'); // 'waitlist' when Stripe not configured
  const sessionId = searchParams.get('session_id');

  const isWaitlist = mode === 'waitlist';

  return (
    <div className="success-page">
      <style>{`
        .success-page {
          --bg-primary: #FBF9F6;
          --accent: #B8976A;
          --accent-dark: #96784F;
          --text-primary: #3D3530;
          --text-secondary: #6B5E56;
          --text-muted: #9C8F87;
          --border: #E8DFD5;
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

        .success-icon { font-size: 4rem; margin-bottom: 24px; }

        .success-title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 400;
          margin-bottom: 16px;
        }

        .success-message {
          color: var(--text-secondary);
          font-size: 1.05rem;
          max-width: 500px;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .success-btn {
          padding: 14px 32px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 6px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .success-btn:hover { background: var(--accent-dark); }

        .success-note {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: 24px;
        }
      `}</style>

      <div className="success-icon">{isWaitlist ? '💌' : '🎉'}</div>

      <h1 className="success-title">
        {isWaitlist ? "You're on the List!" : 'Welcome to First Look!'}
      </h1>

      <p className="success-message">
        {isWaitlist
          ? "We've saved your spot. You'll be the first to know when First Look launches this summer — and you'll get the early-bird price."
          : "Your payment was successful! You now have full access to First Look. Let's set up your first wedding album."}
      </p>

      {isWaitlist ? (
        <a href="/" className="success-btn">Back to Home</a>
      ) : (
        <button className="success-btn" onClick={() => navigate('/signup')}>
          Create Your Account
        </button>
      )}

      <p className="success-note">
        {isWaitlist
          ? 'Questions? Email hello@firstlook.love'
          : 'A receipt has been sent to your email.'}
      </p>
    </div>
  );
};

export default CheckoutSuccess;
