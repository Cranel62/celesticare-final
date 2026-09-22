import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import zodiacCircleImg from '../../assets/images/zodiac_circle.png';

const zodiacSigns = [
  { symbol: '♈', name: 'Aries', desc: 'Bold & Dynamic - Confident styles with fiery accents' },
  { symbol: '♉', name: 'Taurus', desc: 'Luxurious & Earthy - Nature-inspired tones' },
  { symbol: '♊', name: 'Gemini', desc: 'Versatile & Expressive - Mix-and-match pieces' },
  { symbol: '♋', name: 'Cancer', desc: 'Comforting & Nostalgic - Soft textures' },
  { symbol: '♌', name: 'Leo', desc: 'Dramatic & Regal - Bold attention-grabbing pieces' },
  { symbol: '♍', name: 'Virgo', desc: 'Refined & Practical - Functional elegance' },
  { symbol: '♎', name: 'Libra', desc: 'Harmonious & Chic - Balanced ensembles' },
  { symbol: '♏', name: 'Scorpio', desc: 'Intense & Mysterious - Dark transformative hues' },
  { symbol: '♐', name: 'Sagittarius', desc: 'Adventurous & Free - Travel-ready outfits' },
  { symbol: '♑', name: 'Capricorn', desc: 'Classic & Ambitious - Timeless silhouettes' },
  { symbol: '♒', name: 'Aquarius', desc: 'Innovative & Unique - Futuristic cuts' },
  { symbol: '♓', name: 'Pisces', desc: 'Dreamy & Artistic - Ethereal, flowing looks' }
];

export default function LandingPage() {
  const wheelRef = useRef(null);
  const starfieldRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    let lastTime = 0;
    let angle = 0;
    function step(now) {
      if (!lastTime) lastTime = now;
      const delta = now - lastTime;
      lastTime = now;
      angle = (angle + delta * 0.036) % 360;
      if (wheelRef.current) wheelRef.current.style.transform = `rotate(${angle}deg)`;
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, []);

  useEffect(() => {
    const starfield = starfieldRef.current;
    if (!starfield) return;
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      starfield.appendChild(star);
    }
  }, []);

  return (
    <div className="landing-page-wrapper">
      <div className="starfield" ref={starfieldRef}></div>
      <div className="content-container">
        <section className="hero-section">
          <div className="hero-text">
            <h1>Let the stars guide your taste</h1>
            <p>
              CelestiCare pairs your cosmic astrological profile with tailored styling recommendations
              and healthcare requisitions.
            </p>
            <a href="/register" className="hero-btn">Get Started</a>
          </div>
          <div className="hero-image">
            <img ref={wheelRef} src={zodiacCircleImg} alt="Zodiac Wheel" className="wheel" />
          </div>
        </section>

        <section className="zodiac-section">
          <h2 className="section-title">Explore Zodiac Fashion</h2>
          <p className="section-subtitle">Discover pieces matched to your astrological characteristics</p>
          <div className="zodiac-grid">
            {zodiacSigns.map((zodiac) => (
              <div key={zodiac.name} className="zodiac-card">
                <div className="zodiac-icon">{zodiac.symbol}</div>
                <h3>{zodiac.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#e0e0ff' }}>{zodiac.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Transform Your Style?</h2>
          <p>Join CelestiCare to begin your personalized astrological fashion journey.</p>
          <a href="/register" className="cta-btn">Sign In to Your Account</a>
        </section>

        <footer className="landing-footer">
          <p>&copy; 2026 CelestiCare. Powered by MongoDB Atlas.</p>
        </footer>
      </div>
    </div>
  );
}