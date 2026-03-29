import React from 'react';

const LanguageSelector = ({ onNext, data, setData }) => {
  const languages = [
    { id: 'hi', label: 'हिन्दी', native: 'Hindi', icon: '🇮🇳' },
    { id: 'te', label: 'తెలుగు', native: 'Telugu', icon: '🌾' },
    { id: 'ta', label: 'தமிழ்', native: 'Tamil', icon: '🏛️' },
    { id: 'kn', label: 'ಕನ್ನಡ', native: 'Kannada', icon: '🍀' },
    { id: 'mr', label: 'मराठी', native: 'Marathi', icon: '🥥' },
    { id: 'bn', label: 'বাংলা', native: 'Bengali', icon: '🐯' },
    { id: 'ml', label: 'മലയാളം', native: 'Malayalam', icon: '🌴' },
    { id: 'gu', label: 'ગુજરાતી', native: 'Gujarati', icon: '🏜️' },
    { id: 'or', label: 'ଓଡ଼ିଆ', native: 'Odia', icon: '🏺' },
    { id: 'pa', label: 'ਪੰਜਾਬੀ', native: 'Punjabi', icon: '🚜' },
    { id: 'ur', label: 'اردو', native: 'Urdu', icon: '🕌' },
    { id: 'en', label: 'English', native: 'English', icon: '🌎' }
  ];

  return (
    <div className="screen-card animate-in" style={{ padding: '3rem 2rem', maxWidth: '480px' }}>
      <div className="logo-area text-center" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <span style={{ fontSize: '3.5rem', marginBottom: '1rem', display: 'block' }}>🌾</span>
          <div className="pulse-glow" style={{ position: 'absolute', top: '25%', left: '25%', width: '3rem', height: '3rem', background: 'var(--primary)', filter: 'blur(20px)', zIndex: -1 }}></div>
        </div>
        <h1 className="title-glow" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>Farm Seeva</h1>
        <div style={{ height: '2px', width: '40px', background: 'var(--primary)', margin: '0.5rem auto' }}></div>
        <p style={{ fontSize: '0.7rem', letterSpacing: '4px', opacity: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>Intelligent Agriculture Core</p>
      </div>

      <p className="subtitle text-center" style={{ marginBottom: '2.5rem', fontSize: '1rem' }}>Choose your native script to unlock localized AI insights.</p>
      
      <div className="selection-grid" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '0.65rem', 
        maxHeight: '320px', 
        overflowY: 'auto', 
        padding: '2px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--border-glass) transparent'
      }}>
        {languages.map(l => (
          <div 
            key={l.id} 
            className={`selection-card ${data.lang === l.id ? 'selected pulsed' : ''}`}
            onClick={() => setData({ ...data, lang: l.id })}
            style={{ 
              padding: '1.25rem 0.75rem', 
              borderRadius: '20px',
              border: '1px solid var(--border-glass)',
              background: data.lang === l.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {data.lang === l.id && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
            <span className="icon" style={{ fontSize: '1.75rem' }}>{l.icon}</span>
            <div style={{ textAlign: 'center' }}>
              <p className="label" style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '2px' }}>{l.label}</p>
              <p style={{ fontSize: '0.55rem', opacity: 0.5, fontWeight: 700, letterSpacing: '1px' }}>{l.native.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="btn-premium btn-primary" 
        onClick={() => onNext(2)} 
        disabled={!data.lang}
        style={{ 
          marginTop: '2.5rem', 
          width: '100%', 
          height: '60px', 
          fontSize: '1.1rem', 
          fontWeight: 800,
          boxShadow: '0 10px 25px -10px var(--primary-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        Confirm Language <span>→</span>
      </button>
    </div>
  );
};

export default LanguageSelector;
