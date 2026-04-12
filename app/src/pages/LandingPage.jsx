import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const fadeInElements = document.querySelectorAll('.landing-page .fade-in');
    fadeInElements.forEach((el) => observer.observe(el));

    return () => {
      fadeInElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Handle smooth scrolling for anchor links
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle hero CTA button
  const handleHeroCTA = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle waitlist form submission
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setFeedback('Please enter a valid email.');
      setFeedbackType('error');
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    try {
      if (supabase) {
        const { error } = await supabase
          .from('waitlist')
          .insert([{ email: trimmedEmail }]);

        if (error && error.code === '23505') {
          // Unique constraint violation — already on the list
          setFeedback("You're already on the list!");
          setFeedbackType('success');
        } else if (error) {
          throw error;
        } else {
          setFeedback("You're on the list! We'll be in touch.");
          setFeedbackType('success');
          setEmail('');
        }
      } else {
        // Local fallback using localStorage
        const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
        if (!waitlist.includes(trimmedEmail)) {
          waitlist.push(trimmedEmail);
          localStorage.setItem('waitlist', JSON.stringify(waitlist));
        }
        setFeedback("You're on the list! We'll be in touch.");
        setFeedbackType('success');
        setEmail('');
      }

      // Clear feedback after 4 seconds
      setTimeout(() => {
        setFeedback('');
        setFeedbackType('');
      }, 4000);
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setFeedback('Something went wrong. Try again?');
      setFeedbackType('error');
      setTimeout(() => {
        setFeedback('');
        setFeedbackType('');
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-page">
      <style>{`
        .landing-page {
          --bg-primary: #FBF9F6;
          --bg-secondary: #F3EDE4;
          --bg-blush: #FAF0EB;
          --accent: #B8976A;
          --accent-dark: #96784F;
          --accent-rose: #C9917A;
          --text-primary: #3D3530;
          --text-secondary: #6B5E56;
          --text-muted: #9C8F87;
          --border: #E8DFD5;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .landing-page * { margin: 0; padding: 0; box-sizing: border-box; }
        .landing-page { scroll-behavior: smooth; }

        .landing-page {
          font-family: var(--font-body);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          line-height: 1.6;
          overflow-x: hidden;
        }

        .landing-page .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

        /* Navigation */
        .landing-page nav {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(251, 249, 246, 0.95);
          backdrop-filter: blur(12px);
          z-index: 1000;
          border-bottom: 1px solid var(--border);
        }

        .landing-page nav .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
        }

        .landing-page .nav-logo {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: 1.4rem;
          color: var(--text-primary);
          letter-spacing: 0.02em;
          text-decoration: none;
          cursor: pointer;
        }

        .landing-page .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .landing-page .nav-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .landing-page .nav-links a:hover { color: var(--accent-dark); }

        /* Hero */
        .landing-page .hero {
          margin-top: 64px;
          padding: 100px 24px 80px;
          text-align: center;
          background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-blush) 100%);
          position: relative;
        }

        .landing-page .hero h1 {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 7vw, 4.5rem);
          font-weight: 300;
          line-height: 1.15;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          letter-spacing: 0.01em;
        }

        .landing-page .hero h1 em {
          font-style: italic;
          color: var(--accent);
        }

        .landing-page .hero-sub {
          font-family: var(--font-body);
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          color: var(--text-secondary);
          max-width: 560px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }

        .landing-page .hero-cta {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .landing-page .btn {
          padding: 14px 32px;
          border-radius: 6px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.04em;
        }

        .landing-page .btn-primary {
          background-color: var(--accent);
          color: #FFFFFF;
        }

        .landing-page .btn-primary:hover {
          background-color: var(--accent-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(184, 151, 106, 0.25);
        }

        .landing-page .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .landing-page .btn-secondary {
          background: transparent;
          color: var(--text-primary);
          border: 1.5px solid var(--border);
        }

        .landing-page .btn-secondary:hover {
          border-color: var(--accent);
          color: var(--accent-dark);
        }

        .landing-page .hero-note {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* How it Works */
        .landing-page .how-it-works {
          padding: 80px 24px;
          background: var(--bg-primary);
        }

        .landing-page .section-label {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent);
          margin-bottom: 12px;
          text-align: center;
        }

        .landing-page .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          font-weight: 400;
          color: var(--text-primary);
          text-align: center;
          margin-bottom: 3.5rem;
          line-height: 1.25;
        }

        .landing-page .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
        }

        .landing-page .step {
          text-align: center;
          padding: 32px 20px;
          background: white;
          border: 1.5px solid #D4C8BA;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(61, 53, 48, 0.06);
        }

        .landing-page .step-number {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-blush);
          border: 2px solid var(--accent-rose);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--accent-rose);
          font-weight: 500;
        }

        .landing-page .step h3 {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .landing-page .step p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Features */
        .landing-page .features {
          padding: 80px 24px;
          background: var(--bg-secondary);
        }

        .landing-page .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 3rem;
        }

        .landing-page .feature-card {
          background: var(--bg-primary);
          border: 1.5px solid #D4C8BA;
          border-radius: 8px;
          padding: 32px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(61, 53, 48, 0.06);
        }

        .landing-page .feature-card:hover {
          border-color: var(--accent);
          box-shadow: 0 6px 20px rgba(61, 53, 48, 0.1);
          transform: translateY(-2px);
        }

        .landing-page .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: var(--bg-blush);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          font-size: 1.25rem;
        }

        .landing-page .feature-card h3 {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .landing-page .feature-card p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        /* Social Proof */
        .landing-page .social-proof {
          padding: 80px 24px;
          background: var(--bg-primary);
          text-align: center;
        }

        .landing-page .proof-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .landing-page .proof-stat {
          text-align: center;
        }

        .landing-page .proof-number {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 400;
          color: var(--accent);
        }

        .landing-page .proof-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .landing-page .proof-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 550px;
          margin: 0 auto 2rem;
          line-height: 1.7;
        }

        .landing-page .trust-badges {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .landing-page .trust-badge {
          background: var(--bg-secondary);
          border: 1.5px solid #D4C8BA;
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* Pricing */
        .landing-page .pricing {
          padding: 80px 24px;
          background: var(--bg-blush);
        }

        .landing-page .pricing-card {
          max-width: 480px;
          margin: 2rem auto 0;
          background: var(--bg-primary);
          border: 1.5px solid #D4C8BA;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          position: relative;
          box-shadow: 0 4px 16px rgba(61, 53, 48, 0.08);
        }

        .landing-page .pricing-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent);
          color: #FFFFFF;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .landing-page .price {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 300;
          color: var(--text-primary);
          margin: 1.5rem 0;
        }

        .landing-page .price-period {
          color: var(--text-muted);
          font-size: 1rem;
          font-weight: 400;
          font-family: var(--font-body);
        }

        .landing-page .price-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .landing-page .price-features {
          text-align: left;
          list-style: none;
          margin-bottom: 2rem;
        }

        .landing-page .price-features li {
          padding: 10px 0;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border);
          font-size: 0.9rem;
        }

        .landing-page .price-features li:last-child { border-bottom: none; }

        .landing-page .price-features li::before {
          content: '\\2713  ';
          color: var(--accent-rose);
          font-weight: 700;
        }

        .landing-page .pricing .btn-primary { width: 100%; }

        .landing-page .pricing-note {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 16px;
        }

        /* Waitlist */
        .landing-page .waitlist {
          padding: 100px 24px;
          background: var(--bg-primary);
          text-align: center;
        }

        .landing-page .waitlist-content { max-width: 520px; margin: 0 auto; }

        .landing-page .waitlist h2 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: 400;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .landing-page .waitlist-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .landing-page .email-form {
          display: flex;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .landing-page .email-input {
          flex: 1;
          padding: 14px 16px;
          background: #FEFEFE;
          border: 1.5px solid #C4B5A5;
          border-radius: 6px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.9rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .landing-page .email-input::placeholder { color: #B0A498; }
        .landing-page .email-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(184, 151, 106, 0.15); }

        .landing-page .form-feedback {
          font-size: 0.85rem;
          color: var(--text-muted);
          min-height: 24px;
        }

        .landing-page .form-success { color: var(--accent-rose); }

        .landing-page .form-note {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 16px;
        }

        /* Footer */
        .landing-page footer {
          padding: 48px 24px 32px;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
        }

        .landing-page .footer-content {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 32px;
          margin-bottom: 32px;
        }

        .landing-page .footer-section h4 {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .landing-page .footer-section ul { list-style: none; }

        .landing-page .footer-section ul li { margin-bottom: 8px; }

        .landing-page .footer-section a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .landing-page .footer-section a:hover { color: var(--accent-dark); }

        .landing-page .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 24px;
          text-align: center;
        }

        .landing-page .footer-tagline {
          font-family: var(--font-display);
          color: var(--text-muted);
          font-size: 0.95rem;
          font-style: italic;
        }

        /* Animations — fade-in on scroll via IntersectionObserver */
        .landing-page .fade-in {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .landing-page .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Safety: if JS hasn't added .visible after 2s, show content anyway */
        @keyframes fadeInFallback {
          to { opacity: 1; transform: translateY(0); }
        }
        .landing-page .fade-in {
          animation: fadeInFallback 0.5s ease 2s forwards;
        }
        .landing-page .fade-in.visible {
          animation: none;
        }

        /* Prefer reduced motion — skip animations entirely */
        @media (prefers-reduced-motion: reduce) {
          .landing-page .fade-in {
            opacity: 1;
            transform: none;
            transition: none;
            animation: none;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .landing-page .nav-links { gap: 1rem; }
          .landing-page .nav-links a { font-size: 0.75rem; }
          .landing-page .hero { padding: 80px 24px 60px; }
          .landing-page .hero-cta { flex-direction: column; align-items: center; }
          .landing-page .btn { width: 100%; max-width: 320px; text-align: center; }
          .landing-page .steps { grid-template-columns: 1fr; gap: 16px; }
          .landing-page .step { padding: 24px 16px; }
          .landing-page .features, .landing-page .how-it-works, .landing-page .social-proof, .landing-page .pricing, .landing-page .waitlist { padding: 60px 24px; }
          .landing-page .features-grid { grid-template-columns: 1fr; }
          .landing-page .proof-stats { gap: 32px; }
          .landing-page .email-form { flex-direction: column; }
          .landing-page .pricing-card { padding: 32px 24px; }
          .landing-page .footer-content { flex-direction: column; gap: 24px; }
        }
      `}</style>

      {/* Navigation */}
      <nav>
        <div className="container">
          <a href="#" className="nav-logo">First Look</a>
          <ul className="nav-links">
            <li><a href="#how" onClick={(e) => handleSmoothScroll(e, 'how')}>How It Works</a></li>
            <li><a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')}>Features</a></li>
            <li><a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')}>Pricing</a></li>
            <li><a href="#waitlist" onClick={(e) => handleSmoothScroll(e, 'waitlist')}>Waitlist</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>Every Guest Is a<br /><em>Photographer</em></h1>
          <p className="hero-sub">Guests scan a QR code at your table, snap their photos, and upload them right to your private album. No app downloads. No accounts. No data tracking.</p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={handleHeroCTA}>Join the Waitlist</button>
            <a href="#how" className="btn btn-secondary" onClick={(e) => handleSmoothScroll(e, 'how')}>See How It Works</a>
          </div>
          <p className="hero-note">Launching Summer 2026. Be the first to know.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how">
        <div className="container">
          <p className="section-label">Simple by Design</p>
          <h2 className="section-title">Three Steps to Every Photo</h2>

          <div className="steps">
            <div className="step fade-in">
              <div className="step-number">1</div>
              <h3>Print Your Signs</h3>
              <p>Create a beautiful QR code table sign customized to your wedding colors. Print at home or at any print shop.</p>
            </div>
            <div className="step fade-in">
              <div className="step-number">2</div>
              <h3>Guests Scan & Snap</h3>
              <p>No app to download. Guests point their camera at the QR code, take photos, and upload right from their phone.</p>
            </div>
            <div className="step fade-in">
              <div className="step-number">3</div>
              <h3>Relive Every Moment</h3>
              <p>View, share, and download every photo from your wedding in one private album. Metadata is stripped automatically for privacy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="container">
          <p className="section-label">Built for Couples</p>
          <h2 className="section-title">Everything You Need, Nothing You Don't</h2>

          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">📱</div>
              <h3>No App Required</h3>
              <p>Guests upload photos from their phone's browser. No downloads, no signups, no friction. Even grandma can do it.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🔒</div>
              <h3>Private by Default</h3>
              <p>GPS coordinates, camera info, and timestamps are stripped from every photo. Your memories stay yours, not data brokers'.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🎨</div>
              <h3>Customizable Signs</h3>
              <p>Design QR code table signs that match your wedding colors. Print full-page for easels or quarter-page for tabletop acrylic frames.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">📦</div>
              <h3>Bulk Download</h3>
              <p>Download every photo as a zip file with one click. Share the album with family and friends via a private link.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🔐</div>
              <h3>Password Protected</h3>
              <p>Add a password to your album so only invited guests can view photos. Share the password on your wedding website or invitations.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">📺</div>
              <h3>Live Reception Slideshow</h3>
              <p>Display photos on a TV as guests upload them in real time. Open the slideshow URL on any smart TV, Fire Stick, or Chromecast. No laptop needed.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">✨</div>
              <h3>Photo Moderation</h3>
              <p>Review guest uploads before they go live. Approve, reject, or favorite photos — you stay in control of your album.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">💬</div>
              <h3>Guest Book</h3>
              <p>Guests can leave heartfelt messages alongside their photos. A digital guest book you'll actually want to read.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="container">
          <div className="proof-stats">
            <div className="proof-stat">
              <div className="proof-number">0 trackers</div>
              <div className="proof-label">on this page</div>
            </div>
            <div className="proof-stat">
              <div className="proof-number">100%</div>
              <div className="proof-label">client-side</div>
            </div>
            <div className="proof-stat">
              <div className="proof-number">0 bytes</div>
              <div className="proof-label">sent to third parties</div>
            </div>
          </div>

          <p className="proof-text">We built this because every other wedding photo platform scrapes metadata, tracks your guests, or feeds your photos to AI training sets. We think that's wrong.</p>

          <div className="trust-badges">
            <span className="trust-badge">Metadata stripping</span>
            <span className="trust-badge">No third-party tracking</span>
            <span className="trust-badge">No AI training</span>
            <span className="trust-badge">No accounts required</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <p className="section-label">Simple Pricing</p>
          <h2 className="section-title">One Price. Your Whole Wedding.</h2>

          <div className="pricing-card">
            <div className="pricing-badge">Launch Price</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '400', marginTop: '8px', color: 'var(--text-primary)' }}>Wedding Package</h3>
            <div className="price">$99<span className="price-period"> one-time</span></div>
            <p className="price-description">No subscriptions. No per-photo charges. Pay once and use it for your entire wedding journey.</p>

            <ul className="price-features">
              <li>Unlimited photos and albums</li>
              <li>Customizable QR code table signs</li>
              <li>Automatic metadata stripping</li>
              <li>Password-protected sharing</li>
              <li>Bulk download as ZIP</li>
              <li>Beautiful guest upload experience</li>
              <li>Live reception slideshow for smart TVs</li>
              <li>Digital guest book</li>
              <li>Photo moderation controls</li>
              <li>Lifetime access to your photos</li>
            </ul>

            <button className="btn btn-primary" onClick={() => navigate('/checkout?plan=wedding')}>Get Early Access</button>
            <p className="pricing-note">Coming Summer 2026. Early adopters get 50% off.</p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="waitlist" id="waitlist">
        <div className="waitlist-content">
          <h2>Be the First to Know</h2>
          <p className="waitlist-description">Get early access and the launch discount when we go live this summer.</p>

          <form onSubmit={handleWaitlistSubmit}>
            <div className="email-form">
              <input
                type="email"
                className="email-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <button type="submit" className="btn btn-primary" style={{ width: 'auto', whiteSpace: 'nowrap' }} disabled={isSubmitting}>
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
            <div className={`form-feedback ${feedbackType === 'success' ? 'form-success' : feedbackType === 'error' ? 'form-error' : ''}`}>
              {feedback}
            </div>
          </form>

          <p className="form-note">We'll only email you about the launch. Because obviously, we don't share your data.</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#how" onClick={(e) => handleSmoothScroll(e, 'how')}>How It Works</a></li>
              <li><a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')}>Features</a></li>
              <li><a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')}>Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/what-you-need">What You Need</Link></li>
              <li><Link to="/tools/colors">Color Palette Generator</Link></li>
              <li><Link to="/for-planners">For Wedding Planners</Link></li>
              <li><Link to="/for-wedding-party">For the Wedding Party</Link></li>
              <li><Link to="/for-photographers">For Photographers</Link></li>
              <li><Link to="/for-djs">For DJs</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="mailto:hello@firstlook.love">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-tagline">First Look — Made with love and zero trackers.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
