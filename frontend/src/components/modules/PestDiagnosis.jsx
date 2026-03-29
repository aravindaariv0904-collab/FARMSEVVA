import React, { useState, useEffect } from 'react';

const PestDiagnosis = ({ onBack, onNavigate }) => {
  const [step, setStep] = useState('idle'); // idle, scanning, result

  const startScan = () => {
    setStep('scanning');
    setTimeout(() => setStep('result'), 4000);
  };

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Leaf Doctor AI</h2>
      </div>

      {step === 'idle' && (
        <div className="animate-in text-center">
           <p className="subtitle">Is your crop showing signs of disease? Upload a clear photo of the leaf for instant AI diagnosis.</p>
           <div style={{ height: '300px', background: 'rgba(255,255,255,0.02)', border: '2px dashed var(--border-glass)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2rem 0', width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '4rem' }}>🌿</span>
                <p style={{ marginTop: '1rem', fontWeight: 700, opacity: 0.6 }}>Awaiting Leaf Sample</p>
                <button className="btn-premium btn-primary" onClick={startScan} style={{ marginTop: '2.5rem' }}>📸 Snap Leaf Photo</button>
              </div>
           </div>
           <p style={{ fontSize: '0.65rem', opacity: 0.4, fontStyle: 'italic' }}>Powered by Terra AI Vision Protocol v3.1</p>
        </div>
      )}

      {step === 'scanning' && (
        <div className="animate-in text-center" style={{ paddingTop: '3rem' }}>
           <h3 className="title-glow">Analyzing Cellular Structure...</h3>
           <p className="subtitle">Terra AI is cross-referencing your crop symptoms with 50,000+ disease patterns.</p>
           <div style={{ position: 'relative', width: '200px', height: '200px', margin: '3rem auto' }}>
              <div style={{ fontSize: '6rem' }}>🩺</div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--primary)', animation: 'scan 2s linear infinite' }}></div>
              <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--primary-glow)', borderRadius: '50%', animation: 'pulse 1s infinite alternate' }}></div>
           </div>
           <div className="spinner" style={{ margin: '0 auto' }}></div>
           <style>{`@keyframes scan { from { top: 0; } to { top: 100%; } }`}</style>
        </div>
      )}

      {step === 'result' && (
        <div className="animate-in">
           <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--warning)', borderRadius: '24px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>⚠️</span>
              <div>
                <h3 style={{ color: 'var(--warning)', fontWeight: 800 }}>DIAGNOSIS: Leaf Curl Virus</h3>
                <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>CONFIDENCE: 92% (High)</p>
              </div>
           </div>

           <div className="dash-card full-width" style={{ borderLeft: '6px solid var(--primary)' }}>
              <p className="label" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>IMMEDIATE ACTION PLAN</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', border: '1px solid var(--primary-glow)' }}>1</div>
                   <p style={{ fontSize: '0.9rem', flex: 1 }}>Apply **Yellow Sticky Traps** immediately to capture whiteflies (vectors).</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', border: '1px solid var(--primary-glow)' }}>2</div>
                   <p style={{ fontSize: '0.9rem', flex: 1 }}>Spray **Neem Oil (5ml/L)** or appropriate insecticide at 5:00 PM tomorrow.</p>
                </div>
              </div>
           </div>

           <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button className="btn-premium btn-secondary" onClick={() => setStep('idle')} style={{ flex: 1 }}>Re-Scan Leaf</button>
              <button className="btn-premium btn-primary" onClick={() => onNavigate && onNavigate('Marketplace')} style={{ flex: 2 }}>Order Treatment Kit →</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PestDiagnosis;
