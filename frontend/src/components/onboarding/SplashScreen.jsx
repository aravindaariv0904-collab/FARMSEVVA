import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-container">
      <div className="logo-bloom">🌾</div>
      <h1 className="title-glow" style={{ fontSize: '3.5rem', marginTop: '1rem', fontWeight: 900 }}>Farm Seeva</h1>
      <div style={{ height: '2px', width: '60px', background: 'var(--primary)', margin: '1.5rem auto' }}></div>
      <p style={{ letterSpacing: '8px', opacity: 0.6, textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem' }}>AI CORE AGRICULTURE</p>
      
      <div style={{ position: 'absolute', bottom: '10%' }}>
         <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    </div>
  );
};

export default SplashScreen;
