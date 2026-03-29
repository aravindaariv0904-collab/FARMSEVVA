import React from 'react';

const SoilReport = ({ onBack }) => {
  const nutrients = [
    { label: 'Nitrogen (N)', value: 'High', status: 'Optimal', color: 'var(--primary)', percent: 85 },
    { label: 'Phosphorus (P)', value: 'Medium', status: 'Moderate', color: 'var(--info)', percent: 62 },
    { label: 'Potassium (K)', value: 'Optimal', status: 'Rich', color: 'var(--secondary)', percent: 78 },
    { label: 'Zinc (Zn)', value: 'Trace', status: 'Low (Action Needed)', color: 'var(--warning)', percent: 34 },
    { label: 'Org. Carbon', value: '0.65%', status: 'Healthy', color: 'var(--primary)', percent: 72 }
  ];

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Soil Synthesis</h2>
      </div>

      <div style={{ paddingBottom: '2rem' }}>
        <div className="dash-card full-width" style={{ border: '1px solid var(--primary)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
          <p className="label" style={{ color: 'var(--primary)' }}>SOIL HEALTH SCORE</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: '1rem 0' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800 }}>88</h1>
            <div>
              <p style={{ fontWeight: 800, color: 'var(--primary)' }}>GRADE: A (High Quality)</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>Last analyzed: Mar 29, 2026</p>
            </div>
          </div>
        </div>

        <p className="label" style={{ margin: '1.5rem 0' }}>NUTRIENT BREAKDOWN</p>
        {nutrients.map(n => (
          <div key={n.label} className="mandi-card" style={{ padding: '1.25rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700 }}>{n.label}</span>
                <span style={{ color: n.color, fontWeight: 800 }}>{n.status}</span>
             </div>
             <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${n.percent}%`, height: '100%', background: n.color, boxShadow: `0 0 10px ${n.color}` }}></div>
             </div>
          </div>
        ))}

        <div style={{ marginTop: '2rem', background: 'rgba(239, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--warning)' }}>
           <p className="label" style={{ color: 'var(--warning)' }}>CORRECTION PLAN</p>
           <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>🧬 Zinc deficient soil detected.</p>
           <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>Apply Zinc Sulphate 25kg/acre during next fertilization cycle to prevent leaf mottling.</p>
        </div>

        <button className="btn-premium btn-primary" style={{ width: '100%', marginTop: '1.5rem', height: '60px' }}>📄 Download Full PDF Report</button>
      </div>
    </div>
  );
};

export default SoilReport;
