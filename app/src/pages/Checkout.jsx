import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Checkout page — handles the $99 one-time payment flow via Stripe.
 *
 * Flow:
 *   1. User clicks "Get Started" on the pricing section
 *   2. They land here → enter email → click Pay
 *   3. Stripe Checkout session is created (server-side or client redirect)
 *   4. User completes payment on Stripe-hosted checkout
 *   5. Returns to /checkout/success with session_id
 *
 * For now (pre-launch), this page collects intent and redirects
 * to waitlist. When Stripe is configured, it creates real checkout sessions.
 */

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const PRICE_AMOUNT = 99;

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plan = searchParams.get('plan') || 'wedding';

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!STRIPE_PUBLISHABLE_KEY) {
        // Stripe not configured yet — save as pre-order and redirect to waitlist confirmation
        if (isSupabaseConfigured()) {
          await supabase.from('waitlist').upsert(
            [{ email: email.trim(), source: 'checkout', plan }],
            { onConflict: 'email' }
          );
        }
        navigate('/checkout/success?mode=waitlist');
        return;
      }

      // When Stripe IS configured, load Stripe.js and create checkout session
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);

      // For client-only Stripe Checkout (Payment Links), redirect directly
      const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
      if (STRIPE_PAYMENT_LINK) {
        window.location.href = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email.trim())}`;
        return;
      }

      // Fallback: create checkout session via Supabase Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout', {
        body: { email: email.trim(), plan },
      });

      if (fnError) throw fnError;
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.sessionId) {
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (result.error) throw result.error;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <style>{`
        .checkout-page {
          --bg-primary: #FBF9F6;
          --bg-secondary: #F3EDE4;
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
        }

        .checkout-card {
          background: white;
          border-radius: 12px;
          padding: 48px 40px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 4px 24px rgba(61, 53, 48, 0.08);
          border: 1px solid var(--border);
        }

        .checkout-logo {
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--text-primary);
          text-decoration: none;
          cursor: pointer;
          display: block;
          text-align: center;
          margin-bottom: 32px;
        }

        .checkout-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 400;
          text-align: center;
          margin-bottom: 8px;
        }

        .checkout-subtitle {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 32px;
        }

        .checkout-price {
          text-align: center;
          margin-bottom: 32px;
          padding: 20px;
          background: var(--bg-primary);
          border-radius: 8px;
        }

        .checkout-price .amount {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .checkout-price .period {
          font-size: 0.9rem;
          color: var(--text-muted);
          display: block;
          margin-top: 4px;
        }

        .checkout-features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
        }

        .checkout-features li {
          padding: 8px 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .checkout-features li::before {
          content: '✓';
          color: var(--accent);
          font-weight: 600;
          flex-shrink: 0;
        }

        .checkout-form { margin-top: 24px; }

        .checkout-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid var(--border);
          border-radius: 6px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text-primary);
          background: white;
          transition: border-color 0.2s ease;
          margin-bottom: 12px;
        }

        .checkout-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .checkout-btn {
          width: 100%;
          padding: 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 6px;
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }

        .checkout-btn:hover { background: var(--accent-dark); transform: translateY(-1px); }
        .checkout-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .checkout-error {
          color: #c0392b;
          text-align: center;
          font-size: 0.85rem;
          margin-top: 12px;
        }

        .checkout-secure {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 16px;
        }

        .checkout-back {
          text-align: center;
          margin-top: 24px;
        }

        .checkout-back a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
        }

        .checkout-back a:hover { color: var(--accent-dark); }
      `}</style>

      <div className="checkout-card">
        <a href="/" className="checkout-logo">First Look</a>

        <h1 className="checkout-title">Wedding Package</h1>
        <p className="checkout-subtitle">Everything you need for your wedding photos</p>

        <div className="checkout-price">
          <span className="amount">${PRICE_AMOUNT}</span>
          <span className="period">one-time payment · no subscription</span>
        </div>

        <ul className="checkout-features">
          <li>Unlimited photos and albums</li>
          <li>Customizable QR code table signs</li>
          <li>Live reception slideshow</li>
          <li>Guest book messages</li>
          <li>Photo moderation controls</li>
          <li>Lifetime access to your photos</li>
        </ul>

        <form className="checkout-form" onSubmit={handleCheckout}>
          <input
            type="email"
            className="checkout-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button type="submit" className="checkout-btn" disabled={loading}>
            {loading ? 'Processing...' : `Pay $${PRICE_AMOUNT}`}
          </button>
          {error && <p className="checkout-error">{error}</p>}
        </form>

        <p className="checkout-secure">
          🔒 Secure checkout powered by Stripe
        </p>

        <div className="checkout-back">
          <a href="/">← Back to First Look</a>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
