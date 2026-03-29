import React from 'react';

const GovtSchemes = ({ onBack }) => {
  const schemes = [
    { title: 'PM-KISAN Samman Nidhi', amt: '₹6,000 /yr', dead: 'Apr 15', docs: 'Aadhaar, Land Records, Bank Passbook', status: 'Eligible', score: 100, desc: 'Direct income support for farmer landholders.' },
    { title: 'Kisan Credit Card (KCC)', amt: '₹3,00,000 Loan', dead: 'Open', docs: 'Photo ID, Address Proof, Revenue Record', status: 'In Review', score: 85, desc: 'Working capital for cultivation and harvest requirements.' },
    { title: 'Pradhan Mantri Fasal Bima', amt: '100% Insurance', dead: 'May 30', docs: 'Land Deed, Crop Sowing Certificate', status: 'Eligible', score: 95, desc: 'Crop loss insurance from natural calamities.' }
  ];

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Govt Schemes</h2>
      </div>

      <div style={{ padding: '0 1rem 3rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--primary-glow)', marginBottom: '2rem' }}>
          <p className="label" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>PERSONALIZED PORTFOLIO</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>Potential Support: ₹12,000+</p>
          <p className="subtitle" style={{ marginTop: '0.5rem' }}>Matched based on your 5-acre Black Clay soil profile in Guntur grid.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {schemes.map(s => (
            <div key={s.title} className="dash-card full-width" style={{ padding: '1.5rem', borderLeft: '6px solid', borderLeftColor: s.status === 'Eligible' ? 'var(--primary)' : 'var(--info)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                 <div style={{ flex: 1 }}>
                   <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>{s.title}</h4>
                   <p style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.25rem' }}>{s.desc}</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{s.score}% Match</div>
                   <span className="status-badge" style={{ display: 'inline-block', fontSize: '0.55rem', padding: '2px 8px', borderRadius: '10px', background: s.status === 'Eligible' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: s.status === 'Eligible' ? 'var(--primary)' : 'var(--info)', border: '1px solid', borderColor: 'inherit' }}>{s.status}</span>
                 </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-glass)', marginBottom: '1.25rem' }}>
                 <div>
                   <p className="label" style={{ fontSize: '0.5rem', marginBottom: '0.25rem' }}>BENEFIT VALUE</p>
                   <p style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>{s.amt}</p>
                 </div>
                 <div>
                   <p className="label" style={{ fontSize: '0.5rem', marginBottom: '0.25rem' }}>DEADLINE</p>
                   <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--warning)' }}>{s.dead}</p>
                 </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                 <p className="label" style={{ fontSize: '0.5rem', marginBottom: '0.4rem', opacity: 0.7 }}>REQUIRED DOCUMENTS</p>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                   {s.docs.split(', ').map(d => (
                     <span key={d} style={{ fontSize: '0.6rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>{d}</span>
                   ))}
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-premium btn-primary" style={{ flex: 1, padding: '0.85rem', fontSize: '0.8rem' }}>One-Tap Apply →</button>
                <button className="btn-premium btn-secondary" style={{ flex: 0.5, padding: '0.85rem', fontSize: '0.8rem' }}>Guide</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovtSchemes;
