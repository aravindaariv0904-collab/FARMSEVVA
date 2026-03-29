import React, { useState, useEffect } from 'react';

const SoilInputHub = ({ onComplete, onBack, data, setData }) => {
  const [step, setStep] = useState('hub'); // hub, ocr, voice, manual, iot, gps, gps_result
  const [gpsData, setGpsData] = useState({
    type: 'Black Cotton',
    ph: 7.2,
    n: 'Medium',
    p: 'Medium',
    k: 'High',
    zn: 'Trace',
    oc: '0.58%'
  });

  const methods = [
    { id: 'gps', icon: '🛰️', label: 'GPS Auto-Fetch', sub: 'ISRO + ICAR Data', tech: 'SoilGrids API', highlight: true },
    { id: 'ocr', icon: '📸', label: 'Photo Scan OCR', sub: 'Scan Soil Card', tech: 'Tesseract.js' },
    { id: 'voice', icon: '🎙️', label: 'Terra AI Voice', sub: 'Speak to Soil Node', tech: 'Claude AI' },
    { id: 'manual', icon: '✍️', label: 'Manual Form', sub: 'Direct Selection', tech: 'Visual Guides' },
    { id: 'iot', icon: '📡', label: 'IoT Sensor Sync', sub: 'Connect Fasal/SoilCares', tech: 'Bluetooth' }
  ];

  // --- GPS Auto-Fetch Step-by-Step Sequence (Screen 6) ---

  const GPSAutoFetchProgress = () => {
    const [progress, setProgress] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('CONNECTING TO ISRO BHUVAN...');
    
    useEffect(() => {
      const timer = setInterval(() => {
        setProgress(p => {
           if (p < 20) {
             setCurrentStatus('CONNECTING TO ISRO BHUVAN...');
           } else if (p < 40) {
             setCurrentStatus('✓ SOIL TYPE: BLACK COTTON IDENTIFIED');
           } else if (p < 60) {
             setCurrentStatus('FETCHING SOILGRIDS 250M DATA...');
           } else if (p < 80) {
             setCurrentStatus('✓ pH 7.2, NITROGEN MEDIUM DETECTED');
           } else if (p < 100) {
             setCurrentStatus('FETCHING ICAR LOCAL CORE DATA...');
           } else if (p >= 100) {
             clearInterval(timer);
             setTimeout(() => setStep('gps_result'), 800);
             return 100;
           }
           return p + 1.5;
        });
      }, 70);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="animate-in text-center" style={{ padding: '2rem 0' }}>
        <h3 className="title-glow" style={{ fontSize: '1.75rem' }}>Magic Momentum</h3>
        <p className="subtitle">Terra AI is scanning global soil grids for your specific field coordinates.</p>
        
        <div style={{ margin: '3.5rem 0', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div className="orbital-ring" style={{ width: '180px', height: '180px', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '50%', position: 'absolute', animation: 'spin 10s linear infinite' }}></div>
          <div className="orbital-ring" style={{ width: '140px', height: '140px', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '50%', position: 'absolute', animation: 'spin-reverse 15s linear infinite' }}></div>
          <div style={{ fontSize: '5rem', animation: 'float 3s ease-in-out infinite' }}>📡</div>
        </div>

        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--info))', boxShadow: '0 0 20px var(--primary-glow)', transition: 'width 0.1s linear' }}></div>
        </div>
        
        <p style={{ fontSize: '0.8rem', fontWeight: 900, marginTop: '2rem', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>{currentStatus}</p>
        <p style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '1rem', fontWeight: 700 }}>COORDINATES LOCKED: {(data.location?.lat || 0).toFixed(4)}°N, {(data.location?.lng || 0).toFixed(4)}°E</p>
      </div>
    );
  };

  // --- Soil Confirmation Screen (Screen 7) ---
  const GPSResultCard = () => (
    <div className="animate-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 className="title-glow" style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>Grid Profile Ready</h3>
        <p className="subtitle">Official analysis from ISRO & SoilGrids merged via Terra AI.</p>
      </div>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid var(--border-glass)', padding: '2rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '12px 20px', background: 'var(--primary)', borderBottomLeftRadius: '20px', fontSize: '0.6rem', fontWeight: 900 }}>CONFIDENCE 94%</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem' }}>
           <div>
             <p className="label" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>SOIL TYPE</p>
             <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{gpsData.type}</p>
           </div>
           <div>
             <p className="label" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>pH LEVEL</p>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <p style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--secondary)' }}>{gpsData.ph}</p>
               <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--secondary)', borderRadius: '4px' }}>ALKALINE</span>
             </div>
           </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[
            { l: 'NITROGEN (N)', v: gpsData.n, c: 'var(--primary)', p: 65 },
            { l: 'PHOSPHORUS (P)', v: gpsData.p, c: 'var(--info)', p: 42 },
            { l: 'POTASSIUM (K)', v: gpsData.k, c: 'var(--secondary)', p: 88 },
            { l: 'ORG. CARBON', v: gpsData.oc, c: 'white', p: 55 }
          ].map( nutrient => (
            <div key={nutrient.l} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                 <p style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.5 }}>{nutrient.l}</p>
                 <p style={{ fontWeight: 900, fontSize: '0.75rem', color: nutrient.c }}>{nutrient.v}</p>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <div style={{ width: `${nutrient.p}%`, height: '100%', background: nutrient.c, borderRadius: '2px', boxShadow: `0 0 10px ${nutrient.c}` }}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800 }}>AI RECOMMENDATION:</p>
          <p style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.8 }}>Current pH is slightly high. Recommend Urea and Phosphorus for optimal Paddy growth.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn-premium btn-secondary" onClick={() => setStep('hub')} style={{ flex: 1 }}>Recalibrate</button>
        <button className="btn-premium btn-primary" onClick={() => { setData({...data, soilData: gpsData}); onComplete(); }} style={{ flex: 2 }}>Confirm & Plan <span>→</span></button>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '1.5rem', fontWeight: 700, cursor: 'pointer', opacity: 0.6 }}>Tap any field to refine manually</p>
    </div>
  );

  // --- Manual Form Component ---
  const ManualForm = () => {
    const [localData, setLocalData] = useState(gpsData);
    const nutrients = [
      { id: 'n', label: 'Nitrogen (N)', color: 'var(--primary)' },
      { id: 'p', label: 'Phosphorus (P)', color: 'var(--info)' },
      { id: 'k', label: 'Potassium (K)', color: 'var(--secondary)' }
    ];

    return (
      <div className="animate-in">
        <h3 className="title-glow" style={{ fontSize: '1.75rem' }}>Soil Lab Input</h3>
        <p className="subtitle">Enter the values from your official Soil Health Card for maximum AI accuracy.</p>
        
        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="label" style={{ fontSize: '0.7rem', marginBottom: '0.75rem', fontWeight: 800 }}>SELECT SOIL TYPE</label>
            <select className="input-premium" style={{ background: 'rgba(0,0,0,0.3)', height: '56px' }} value={localData.type || 'Black Cotton'} onChange={e => setLocalData({...localData, type: e.target.value})}>
              <option>Black Cotton</option>
              <option>Red Sandy</option>
              <option>Laterite</option>
              <option>Alluvial</option>
              <option>Peaty/Organic</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.5rem' }}>
             {['🌾 Black', '🍂 Red', '🏖️ Sandy', '🌑 Loamy'].map(t => (
               <div key={t} onClick={() => setLocalData({...localData, type: t.split(' ')[1]})} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', border: '1px solid var(--border-glass)' }}>{t}</div>
             ))}
          </div>

          {nutrients.map(n => (
            <div key={n.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '24px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: n.color }}>{n.label}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>{localData[n.id]}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Low', 'Medium', 'High'].map(v => (
                  <button 
                    key={v}
                    onClick={() => setLocalData({...localData, [n.id]: v})}
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      fontSize: '0.7rem', 
                      borderRadius: '12px', 
                      background: localData[n.id] === v ? n.color : 'rgba(255,255,255,0.03)',
                      color: 'white',
                      border: 'none',
                      fontWeight: 900,
                      transition: '0.3s'
                    }}
                  >{v}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
          <button className="btn-premium btn-secondary" onClick={() => setStep('hub')} style={{ flex: 1 }}>Back</button>
          <button className="btn-premium btn-primary" onClick={() => { setGpsData(localData); setStep('gps_result'); }} style={{ flex: 2 }}>Validate Data</button>
        </div>
      </div>
    );
  };

  // --- OCR Scanner Component ---
  const OCRScanner = () => {
    const [scanned, setScanned] = useState(false);
    
    useEffect(() => {
      const t = setTimeout(() => setScanned(true), 3000);
      return () => clearTimeout(t);
    }, []);

    return (
      <div className="animate-in text-center">
        <h3 className="title-glow" style={{ fontSize: '1.75rem' }}>{scanned ? 'Scan Successful' : 'Neural Scanning...'}</h3>
        <p className="subtitle">{scanned ? 'Soil data extracted precisely from your card.' : 'Align your Soil Health Card within the frame.'}</p>
        
        <div style={{ position: 'relative', width: '300px', height: '420px', margin: '2.5rem auto', background: 'rgba(255,255,255,0.02)', border: '2px solid var(--border-glass)', borderRadius: '40px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!scanned && <div className="scan-line" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary)', animation: 'scan 2s infinite linear' }}></div>}
          <div style={{ fontSize: '6rem', opacity: scanned ? 1 : 0.1 }}>📄</div>
          {scanned && (
            <div className="animate-in" style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ fontSize: '3rem' }}>✅</div>
               <p style={{ fontWeight: 900, color: 'var(--primary)', marginTop: '1rem', fontSize: '1rem' }}>READY</p>
            </div>
          )}
        </div>

        {scanned ? (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-premium btn-secondary" onClick={() => setStep('hub')} style={{ flex: 1 }}>Retry</button>
            <button className="btn-premium btn-primary" onClick={() => setStep('gps_result')} style={{ flex: 2 }}>Review Extracted Data</button>
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '2px' }}>TESSERACT AI INITIATED...</p>
        )}
      </div>
    );
  };

  const HubView = () => (
    <div className="animate-in">
      <h2 className="title-glow" style={{ fontSize: '2rem' }}>Soil Input Hub</h2>
      <p className="subtitle">Select the most accurate profiling method for your localized acreage.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2.5rem' }}>
        {methods.map(m => (
          <div 
            key={m.id} 
            className={`dash-card full-width ${m.highlight ? 'highlight-border' : ''}`} 
            onClick={() => setStep(m.id)}
            style={{ 
              background: m.highlight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
              border: m.highlight ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
              padding: '1.5rem',
              borderRadius: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem' }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h4 style={{ fontWeight: 900, fontSize: '1.1rem' }}>{m.label}</h4>
                  {m.highlight && <span style={{ fontSize: '0.6rem', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontWeight: 900, letterSpacing: '1px' }}>INSTANT ⭐</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700 }}>{m.sub}</p>
                  <p style={{ fontSize: '0.55rem', opacity: 0.4, fontWeight: 800 }}>TECH: {m.tech}</p>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', opacity: 0.2 }}>→</div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-premium btn-secondary" onClick={onBack} style={{ width: '100%', marginTop: '2.5rem', height: '60px', borderRadius: '20px' }}>Back to Field Selection</button>
    </div>
  );

  return (
    <div className="screen-card" style={{ padding: '3.5rem 2.5rem', width: '100%', maxWidth: '500px', borderRadius: '48px' }}>
      {step === 'hub' && <HubView />}
      {step === 'ocr' && <OCRScanner />}
      {step === 'gps' && <GPSAutoFetchProgress />}
      {step === 'gps_result' && <GPSResultCard />}
      {step === 'manual' && <ManualForm />}
      {(step === 'voice' || step === 'iot') && (
        <div className="text-center animate-in">
          <div style={{ margin: '3rem 0', position: 'relative', display: 'inline-block' }}>
            <div style={{ fontSize: '6rem' }}>🛰️</div>
            <div className="pulse-glow" style={{ position: 'absolute', top: '20%', left: '20%', width: '3rem', height: '3rem', background: 'var(--info)', filter: 'blur(30px)', opacity: 0.4 }}></div>
          </div>
          <h3 className="title-glow" style={{ fontSize: '1.75rem' }}>Neural Node Expansion</h3>
          <p className="subtitle" style={{ marginBottom: '2.5rem' }}>The {step.toUpperCase()} protocol is being calibrated for your regional cluster. Please use orbital fetch for now.</p>
          <button onClick={() => setStep('gps')} className="btn-premium btn-primary" style={{ width: '100%', height: '60px', borderRadius: '20px' }}>Initiate Orbital Fetch <span>🛰️</span></button>
          <p onClick={() => setStep('hub')} style={{ marginTop: '1.5rem', fontSize: '0.8rem', fontWeight: 800, opacity: 0.5, cursor: 'pointer' }}>Return to Hub</p>
        </div>
      )}
    </div>
  );
};

export default SoilInputHub;
