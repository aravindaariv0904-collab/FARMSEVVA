import React from 'react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-container" style={{ 
      width: '100%', 
      background: 'var(--bg-dark)', 
      color: 'white', 
      overflowX: 'hidden',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Header */}
      <header className="glass-panel" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌾</span>
          <span style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '1.2rem' }}>FARM SEEVA</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <select style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '0.8rem', fontWeight: 700 }}>
            <option>ENGLISH</option>
            <option>हिन्दी</option>
            <option>తెలుగు</option>
          </select>
          <button onClick={onStart} className="btn-premium btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', borderRadius: '12px' }}>Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 2rem', position: 'relative', overflow: 'hidden'
      }}>
        <div className="pulse-glow" style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }}></div>
        
        <h1 className="title-glow animate-in" style={{ fontSize: '4.5rem', fontWeight: 900, maxWidth: '900px', lineHeight: 1.1, zIndex: 1 }}>
          Your Farm. Your Language.<br/>
          <span style={{ color: 'var(--primary)' }}>AI that works anywhere.</span>
        </h1>
        <p className="animate-in" style={{ fontSize: '1.25rem', opacity: 0.6, marginTop: '2rem', maxWidth: '600px', zIndex: 1 }}>
          From soil to harvest — one app for every decision. Trusted by 10,000+ farmers across 12 Indian languages.
        </p>
        
        <div className="animate-in" style={{ display: 'flex', gap: '1.5rem', marginTop: '3.5rem', zIndex: 1 }}>
          <button onClick={onStart} className="btn-premium btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
            🌾 Start Free Onboarding
          </button>
          <button className="btn-premium btn-secondary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
            📱 Watch Demo
          </button>
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', opacity: 0.4, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px' }}>
          <span>12 LANGUAGES</span>
          <span>OFFLINE FIRST</span>
          <span>FREE SATELLITE DATA</span>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '8rem 2rem', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="title-glow text-center" style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>Engineered for Indian Reality</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { t: 'AI Crop Intelligence', d: 'Personalized recommendations based on your specific grid.', i: '🧠', c: 'var(--primary)' },
              { t: 'Speaks Your Language', d: '12 Indian languages with full voice input support.', i: '🗣️', c: 'var(--info)' },
              { t: 'Works Offline', d: 'No internet? No problem. Use SMS and local caching.', i: '📡', c: 'var(--secondary)' }
            ].map(f => (
              <div key={f.t} className="dash-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>{f.i}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>{f.t}</h3>
                <p style={{ opacity: 0.6, fontSize: '1rem', lineHeight: 1.6 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
           <h2 className="title-glow" style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>From Soil to Profit in 4 Steps</h2>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             {[
               { s: 'Step 1', t: 'Locate your farm (GPS auto-detection)', i: '📍' },
               { s: 'Step 2', t: 'Soil analysis (5 methods, 30 seconds)', i: '🌱' },
               { s: 'Step 3', t: 'AI recommendations (Top crops + calendar)', i: '🤖' },
               { s: 'Step 4', t: 'Track & Earn (Market prices + schemes)', i: '📈' }
             ].map((st, i) => (
               <div key={i} className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
                 <div style={{ fontSize: '2.5rem' }}>{st.i}</div>
                 <div style={{ textAlign: 'left' }}>
                   <p className="label" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{st.s}</p>
                   <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{st.t}</h4>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '6rem 2rem', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { v: '12', l: 'LANGUAGES' },
            { v: '140M+', l: 'FARMERS' },
            { v: '99%', l: 'VILLAGE COVERAGE' },
            { v: '40%', l: 'WATER SAVINGS' }
          ].map(s => (
            <div key={s.l}>
              <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>{s.v}</h2>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', opacity: 0.8 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '8rem 2rem' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
           <h2 className="title-glow text-center" style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>Success Stories</h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
             {[
               { q: "Increased my profit by 35% using crop recommendations.", n: "Ram", l: "Maharashtra" },
               { q: "Saved 40% water with drip irrigation advice.", n: "Priya", l: "Tamil Nadu" },
               { q: "Got ₹6000 PM-KISAN through app notification.", n: "Abdullah", l: "Uttar Pradesh" }
             ].map((t, i) => (
               <div key={i} className="dash-card" style={{ padding: '2rem' }}>
                 <p style={{ fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.8)' }}>"{t.q}"</p>
                 <p style={{ fontWeight: 800, color: 'var(--primary)' }}>- {t.n}, {t.l}</p>
               </div>
             ))}
           </div>
         </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <span>WhatsApp</span>
          <span>YouTube</span>
          <span>Facebook</span>
        </div>
        <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>© 2026 Farm Seeva - Empowering Indian Farmers</p>
      </footer>
    </div>
  );
};

export default LandingPage;
