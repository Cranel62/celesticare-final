import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LandingPage.css';

// Local asset import with fallback handling
import zodiacCircleImg from '../../assets/images/zodiac_circle.png';

const zodiacSigns = [
  { symbol: '♈', name: 'Aries', slug: 'aries', elem: 'fire', desc: 'Bold & Dynamic - Confident, energetic styles with fiery accents' },
  { symbol: '♉', name: 'Taurus', slug: 'taurus', elem: 'earth', desc: 'Luxurious & Earthy - Quality fabrics and nature-inspired tones' },
  { symbol: '♊', name: 'Gemini', slug: 'gemini', elem: 'air', desc: 'Versatile & Expressive - Mix-and-match pieces for every occasion' },
  { symbol: '♋', name: 'Cancer', slug: 'cancer', elem: 'water', desc: 'Comforting & Nostalgic - Soft textures and sentimental pieces' },
  { symbol: '♌', name: 'Leo', slug: 'leo', elem: 'fire', desc: 'Dramatic & Regal - Bold statements and attention-grabbing pieces' },
  { symbol: '♍', name: 'Virgo', slug: 'virgo', elem: 'earth', desc: 'Refined & Practical - Tailored fits and functional elegance' },
  { symbol: '♎', name: 'Libra', slug: 'libra', elem: 'air', desc: 'Harmonious & Chic - Balanced ensembles and romantic touches' },
  { symbol: '♏', name: 'Scorpio', slug: 'scorpio', elem: 'water', desc: 'Intense & Mysterious - Dark hues and transformative pieces' },
  { symbol: '♐', name: 'Sagittarius', slug: 'sagittarius', elem: 'fire', desc: 'Adventurous & Free - Bohemian styles and travel-ready outfits' },
  { symbol: '♑', name: 'Capricorn', slug: 'capricorn', elem: 'earth', desc: 'Classic & Ambitious - Timeless silhouettes and professional elegance' },
  { symbol: '♒', name: 'Aquarius', slug: 'aquarius', elem: 'air', desc: 'Innovative & Unique - Futuristic cuts and unconventional styling' },
  { symbol: '♓', name: 'Pisces', slug: 'pisces', elem: 'water', desc: 'Dreamy & Artistic - Flowing fabrics and ethereal, romantic looks' },
];

export default function LandingPage() {
  const wheelRef = useRef(null);
  const starfieldRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 1. Rotating Zodiac Wheel Animation
  useEffect(() => {
    let rafId = null;
    let lastTime = 0;
    let angle = 0;
    const ROTATIONS_PER_SECOND = 0.08;
    const degreesPerMs = (ROTATIONS_PER_SECOND * 360) / 1000;

    function step(now) {
      if (!lastTime) lastTime = now;
      const delta = now - lastTime;
      lastTime = now;
      angle = (angle + delta * degreesPerMs) % 360;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${angle}deg)`;
      }
      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // 2. Dynamic Starfield & Shooting Stars
  useEffect(() => {
    const starfield = starfieldRef.current;
    if (!starfield) return;

    const starCount = 150;
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = Math.random() * 0.7 + 0.3;
      starfield.appendChild(star);
      stars.push(star);
    }

    return () => {
      if (starfield) starfield.innerHTML = '';
    };
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/get-to-know');
    }
  };

  return (
    <div className="landing-page-wrapper">
      {/* Starfield Background */}
      <div className="starfield" ref={starfieldRef}></div>

      <div className="content-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-text">
            <h1>Let the stars guide your taste</h1>
            <p>
              The stylist of the stars, CelestiCare, gives you the latest fashion tips by using your zodiac sign
              and matching it to your preferred style preferences and aesthetics.
            </p>
            <button type="button" onClick={handleGetStarted} className="hero-btn" style={{ cursor: 'pointer' }}>
              Get Started
            </button>
          </div>

          <div className="hero-image">
            <img 
              ref={wheelRef} 
              src={zodiacCircleImg} 
              alt="Zodiac Wheel" 
              className="wheel" 
              draggable="false" 
              onClick={() => navigate('/zodiac')}
              title="Click to explore the Zodiacs"
            />
          </div>
        </section>

        {/* New Features Intro */}
        <div className="new-features-intro">
          <div className="container" style={{ textAlign: 'center' }}>
            <h3>⟡˙⋆ Introducing Deeper Cosmic Insights ⋆˙⟡</h3>
            <p>We've expanded our celestial offerings to provide you with personalized guidance for your unique energy</p>
          </div>
        </div>

        {/* Mystic Features Section */}
        <section className="features-section">
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 className="section-title">Discover Our New Mystic Features</h2>
            <p className="section-subtitle">Go beyond your sun sign with comprehensive astrological readings and tarot guidance</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              {/* Feature 1: AstroView */}
              <div 
                className="feature-card" 
                onClick={() => navigate('/zodiac')} 
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon">
                  <i className="fas fa-star-and-crescent"></i>
                </div>
                <h4>Complete Element & Sign Views</h4>
                <p>Explore full planetary associations, elements, ruling planets, and style recommendations for all 12 signs.</p>
                <div className="feature-badge">AstroView Active</div>
              </div>

              {/* Feature 2: Mystic Arcana Tarot */}
              <div 
                className="feature-card" 
                onClick={() => navigate('/forecast')} 
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon">
                  <i className="fas fa-crystal-ball"></i>
                </div>
                <h4>Mystic Arcana Tarot</h4>
                <p>Pull daily celestial wisdom or deep multi-card spreads focusing on your heart, head, and life path.</p>
                <div className="feature-badge">Tarot Oracle</div>
              </div>

              {/* Feature 3: Tailored Styling */}
              <div 
                className="feature-card" 
                onClick={handleGetStarted} 
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon">
                  <i className="fas fa-palette"></i>
                </div>
                <h4>Personalized Style Profile</h4>
                <p>Match your seasonal undertones and aesthetic to curated clothing recommendations and healthcare items.</p>
                <div className="feature-badge">Style Studio</div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Zodiacs */}
        <section className="zodiac-section">
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 className="section-title">Explore Zodiac Fashion</h2>
            <p className="section-subtitle">Each sign has unique style characteristics. Click any sign to view details!</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {zodiacSigns.map((zodiac) => (
                <div 
                  key={zodiac.name} 
                  className="zodiac-card"
                  onClick={() => navigate(`/zodiac?view=sign&elem=${zodiac.elem}&sign=${zodiac.slug}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="zodiac-icon">{zodiac.symbol}</div>
                  <h5>{zodiac.name}</h5>
                  <p className="zodiac-desc">{zodiac.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Transform Your Style?</h2>
              <p>Join CelestiCare to pair astrology with personalized style and healthcare requisitions.</p>
              <Link to={isAuthenticated ? "/dashboard" : "/login"} className="cta-btn">
                {isAuthenticated ? "Go to Dashboard" : "Sign In to Your Account"}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <div className="footer-brand" style={{ marginBottom: '15px' }}>CELESTICARE</div>
            <p style={{ color: '#e0e0ff', maxWidth: '600px', margin: '0 auto 25px', fontSize: '0.95rem' }}>
              Where astrology meets modern care and style. Powered securely by MongoDB Atlas & React.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '25px', fontSize: '0.95rem' }}>
              <Link to="/" style={{ color: '#c19bfa', textDecoration: 'none' }}>Home</Link>
              <Link to="/zodiac" style={{ color: '#c19bfa', textDecoration: 'none' }}>Zodiacs</Link>
              <Link to="/forecast" style={{ color: '#c19bfa', textDecoration: 'none' }}>Mystic Arcana</Link>
              <Link to="/get-to-know" style={{ color: '#c19bfa', textDecoration: 'none' }}>Get Started</Link>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              &copy; 2026 CelestiCare. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}