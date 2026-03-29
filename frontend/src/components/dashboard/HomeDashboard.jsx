import React, { useState, useEffect } from 'react';

const Card = ({ title, icon, color, sub, onClick, fullWidth, highlight }) => (
  <div className={`dash-card ${fullWidth ? 'full-width' : ''}`} onClick={onClick} style={{ 
    border: highlight ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
    background: highlight ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
    boxShadow: highlight ? '0 10px 30px -10px var(--primary-glow)' : 'none',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: fullWidth ? '0.5rem' : '1rem' }}>
      <div style={{ 
        width: '44px', height: '44px', borderRadius: '12px', 
        background: `rgba(${color}, 0.1)`, 
        border: `1px solid rgba(${color}, 0.2)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' 
      }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 900 }}>{title}</h4>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>{sub}</p>
      </div>
    </div>
    {fullWidth && !highlight && (
      <div style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Interactive Analysis Ready</p>
        <span style={{ fontSize: '1.25rem' }}>→</span>
      </div>
    )}
  </div>
);

const HomeDashboard = ({ user, farm, onNavigate, t }) => {
  const [soilScore, setSoilScore] = useState(0);
  const [profit, setProfit] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const soilTimer = setInterval(() => {
      setSoilScore(prev => {
        if (prev >= 78) { clearInterval(soilTimer); return 78; }
        return prev + 1;
      });
    }, 30);

    const profitTimer = setInterval(() => {
      setProfit(prev => {
        if (prev >= 50000) { clearInterval(profitTimer); return 50000; }
        return prev + 500;
      });
    }, 15);

    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      clearInterval(soilTimer);
      clearInterval(profitTimer);
      clearTimeout(confettiTimer);
    };
  }, []);

  return (
    <div className="screen-container animate-in" style={{ paddingBottom: '6rem', position: 'relative' }}>
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="confetti" style={{ 
              position: 'absolute',
              top: '-10%',
              left: `${Math.random() * 100}%`,
              width: '10px',
              height: '10px',
              background: ['var(--primary)', 'var(--info)', 'var(--secondary)', 'var(--warning)'][Math.floor(Math.random() * 4)],
              opacity: Math.random(),
              animation: `fall ${2 + Math.random() * 3}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}></div>
          ))}
        </div>
      )}

      {/* Top Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
        <div>
          <h1 className="title-glow" style={{ fontSize: '2.2rem', fontWeight: 900 }}>{t('welcome')}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>{user.name || 'Ram Naidu'}</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
            <span style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 700 }}>{t('grid')} 🛰️</span>
          </div>
        </div>
        <div onClick={() => onNavigate('Profile')} style={{ width: '56px', height: '56px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 10px 20px -5px var(--primary-glow)', cursor: 'pointer' }}>🧑‍🌾</div>
      </nav>

      {/* Weather Widget */}
      <div className="dash-card full-width" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05), rgba(59, 130, 246, 0.05))', border: '1px solid var(--border-glass)' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <span style={{ fontSize: '3rem' }}>☀️</span>
               <div>
                  <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>34°C</p>
                  <p style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 800 }}>CLEAR SKIES • DEW POINT 18°</p>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
               {['☀️','⛅','🌦️'].map((w,i)=><div key={i} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}><p style={{fontSize: '1rem'}}>{w}</p><p style={{fontSize: '0.5rem', opacity: 0.5}}>D+{i+1}</p></div>)}
            </div>
         </div>
      </div>

      {/* Soil Health Card Section */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h3 className="label" style={{ marginBottom: '1rem', opacity: 0.6 }}>{t('soil')}</h3>
        <div className="dash-card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--primary)', position: 'relative' }}>
           <div style={{ position: 'absolute', top: 15, right: 15, fontSize: '0.6rem', fontWeight: 900, color: 'var(--primary)' }}>LAST TEST: 22 MAR 2026</div>
           <p className="label" style={{ fontSize: '0.65rem', color: 'var(--primary)', marginBottom: '1rem' }}>SOIL HEALTH SCORE</p>
           <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white' }}>{soilScore}</div>
              <svg style={{ position: 'absolute', top: -15, left: -15, width: '110px', height: '110px', transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="55" cy="55" r="45" fill="transparent" stroke="var(--primary)" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * soilScore) / 100} style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
              </svg>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { l: 'N', v: 'MED', c: 'var(--primary)' },
                { l: 'P', v: 'LOW', c: 'var(--info)' },
                { l: 'K', v: 'HI', c: 'var(--secondary)' },
                { l: 'Zn', v: 'TRCE', c: 'var(--accent)' }
              ].map(n => <div key={n.l} style={{ padding: '10px 0', border: '1px solid var(--border-glass)', borderRadius: '14px', background: 'rgba(255,255,255,0.02)' }}><p style={{fontSize: '0.5rem', fontWeight: 900, opacity: 0.4}}>{n.l}</p><p style={{fontSize: '0.75rem', fontWeight: 900, color: n.c}}>{n.v}</p></div> )}
           </div>
           <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>⚡ RECOMMENDATION: APPLY ZINC SULPHATE</p>
        </div>
      </section>

      {/* Today's Tasks */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h3 className="label" style={{ marginBottom: '1rem', opacity: 0.6 }}>TODAY'S CORE TASKS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
           {[
             { t: 'Irrigation - Day 15', d: 'Water depth: 5cm at Grid 8A', i: '💧', s: 'Done' },
             { t: 'Pest Scouting', d: 'Check Chilli leaves for whitefly', i: '🩺', s: 'Scan' },
             { t: 'Fertilizer Application', d: 'Apply Urea mix-12', i: '🧪', s: 'Details' }
           ].map(task => (
             <div key={task.t} className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
                <div style={{ fontSize: '1.75rem' }}>{task.i}</div>
                <div style={{ flex: 1 }}>
                   <p style={{ fontWeight: 900, fontSize: '0.9rem' }}>{task.t}</p>
                   <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>{task.d}</p>
                </div>
                <button className="btn-premium btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }}>{task.s}</button>
             </div>
           ))}
        </div>
      </section>

      {/* Market Prices */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h3 className="label" style={{ marginBottom: '1rem', opacity: 0.6 }}>LIVE MARKET PRICES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
           {[
             { c: 'COTTON', p: '₹8,400', tr: '📈 +15%', col: 'var(--primary)' },
             { c: 'WHEAT', p: '₹3,200', tr: '📉 -2%', col: 'var(--warning)' }
           ].map(p => (
             <div key={p.c} className="dash-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.6 }}>{p.c} (QUINTAL)</p>
                <div style={{ margin: '8px 0' }}>
                   <p style={{ fontSize: '1.25rem', fontWeight: 900 }}>{p.p}</p>
                   <p style={{ fontSize: '0.65rem', fontWeight: 900, color: p.col }}>{p.tr}</p>
                </div>
                <p style={{ fontSize: '0.5rem', opacity: 0.4 }}>GUNTUR MANDI</p>
             </div>
           ))}
        </div>
      </section>

      {/* Crop Calendar Preview */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 className="label" style={{ marginBottom: '1rem', opacity: 0.6 }}>CROP CYCLE TIMELINE</h3>
        <div className="dash-card full-width" style={{ padding: '1.5rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 900 }}>SOWING PHASE</p>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--info)' }}>45 DAYS TO HARVEST</span>
           </div>
           <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-glass)', position: 'relative' }}>
              <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--info))', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.55rem', fontWeight: 700, opacity: 0.4 }}>
              <span>MAR</span>
              <span>APR</span>
              <span style={{ color: 'white', opacity: 1 }}>MAY (NOW)</span>
              <span>JUN</span>
           </div>
        </div>
      </section>

      {/* Govt Schemes */}
      <section style={{ marginBottom: '2rem' }}>
         <h3 className="label" style={{ marginBottom: '1rem', opacity: 0.6 }}>GOVERNMENT SCHEMES</h3>
         <div className="dash-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--info)', background: 'rgba(59, 130, 246, 0.05)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <span style={{ fontSize: '2rem' }}>🏛️</span>
               <div>
                  <h4 style={{ fontWeight: 900, fontSize: '0.9rem' }}>PM-KISAN: ELIGIBLE ✅</h4>
                  <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>₹6,000/year Subsidy matched</p>
               </div>
            </div>
            <button className="btn-premium btn-primary" style={{ padding: '8px 16px', fontSize: '0.7rem', background: 'var(--info)' }}>Apply</button>
         </div>
      </section>

      <style>{`
        @keyframes fall { to { transform: translateY(110vh) rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
};

export default HomeDashboard;
