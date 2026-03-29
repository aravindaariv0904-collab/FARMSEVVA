import React, { useState } from 'react';

const CropIrrigationSelection = ({ onNext, onBack, data, setData }) => {
  const [localData, setLocalData] = useState({
    farmingStyle: data.farmingStyle || 'Single Crop',
    irrigation: data.irrigation || 'Drip',
    crops: data.crops || []
  });

  const crops = [
    { id: 'paddy', label: 'Paddy (Rice)', icon: '🌾', suitability: 95, color: '#4ADE80' },
    { id: 'cotton', label: 'Cotton', icon: '☁️', suitability: 82, color: '#4ADE80' },
    { id: 'chilli', label: 'Guntur Chilli', icon: '🌶️', suitability: 78, color: '#FBBF24' },
    { id: 'maize', label: 'Maize (Corn)', icon: '🌽', suitability: 64, color: '#FBBF24' },
    { id: 'turmeric', label: 'Turmeric', icon: '🫚', suitability: 42, color: '#F87171' }
  ];

  const irrigationTypes = [
    { id: 'Drip', label: 'Drip Irrigation', icon: '💧', sub: '40% Water Savings', roi: '1.2 Seasons' },
    { id: 'Flood', label: 'Flood/Canal', icon: '🌊', sub: 'Traditional Method', roi: 'N/A' },
    { id: 'Rain-fed', label: 'Rain-fed', icon: '☁️', sub: 'Natural Cycle', roi: 'N/A' }
  ];

  const systems = ['Single Crop', 'Multi-Crop', 'Horticulture'];

  const toggleCrop = (id) => {
    const newCrops = localData.crops.includes(id) 
      ? localData.crops.filter(c => c !== id)
      : [...localData.crops, id];
    setLocalData({ ...localData, crops: newCrops });
  };

  const handleFinish = () => {
    setData({ ...data, ...localData });
    onNext();
  };

  return (
    <div className="screen-card animate-in" style={{ padding: '2.5rem 2rem', maxWidth: '480px' }}>
      <h2 className="title-glow" style={{ fontSize: '1.8rem' }}>Crop & Water Plan</h2>
      <p className="subtitle">AI recommendations based on your soil profile and local weather patterns.</p>

      <div style={{ marginTop: '2rem' }}>
        <p className="label" style={{ fontSize: '0.65rem', marginBottom: '1rem', letterSpacing: '1px' }}>1. CROPPING SYSTEM</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {systems.map(s => (
            <button
              key={s}
              onClick={() => setLocalData({ ...localData, farmingStyle: s })}
              style={{
                flex: 1,
                padding: '0.75rem 0.5rem',
                fontSize: '0.7rem',
                borderRadius: '12px',
                background: localData.farmingStyle === s ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                fontWeight: 800,
                color: 'white',
                transition: '0.3s'
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <p className="label" style={{ fontSize: '0.65rem', marginBottom: '1rem', letterSpacing: '1px' }}>2. SELECT TARGET CROPS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {crops.map(c => (
            <div 
              key={c.id}
              onClick={() => toggleCrop(c.id)}
              className={`dash-card ${localData.crops.includes(c.id) ? 'selected' : ''}`}
              style={{ 
                padding: '1rem', 
                border: localData.crops.includes(c.id) ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                background: localData.crops.includes(c.id) ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{c.label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                      <div style={{ width: `${c.suitability}%`, height: '100%', background: c.color, borderRadius: '2px' }}></div>
                    </div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: c.color }}>{c.suitability}% Match</span>
                  </div>
                </div>
                {localData.crops.includes(c.id) && <span style={{ color: 'var(--primary)' }}>✔</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <p className="label" style={{ fontSize: '0.65rem', marginBottom: '1rem', letterSpacing: '1px' }}>3. IRRIGATION METHOD</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {irrigationTypes.map(i => (
            <div 
              key={i.id}
              onClick={() => setLocalData({ ...localData, irrigation: i.id })}
              style={{
                padding: '1rem 0.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-glass)',
                background: localData.irrigation === i.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                border: localData.irrigation === i.id ? '1px solid var(--info)' : '1px solid var(--border-glass)',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{i.icon}</div>
              <p style={{ fontSize: '0.6rem', fontWeight: 900 }}>{i.label}</p>
              {localData.irrigation === i.id && <p style={{ fontSize: '0.45rem', color: 'var(--info)', marginTop: '4px', fontWeight: 800 }}>ROI: {i.roi}</p>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
        <button className="btn-premium btn-secondary" onClick={onBack} style={{ flex: 1 }}>Back</button>
        <button 
           className="btn-premium btn-primary" 
           onClick={handleFinish} 
           style={{ flex: 2 }}
           disabled={localData.crops.length === 0}
        >Analyze Farm <span>→</span></button>
      </div>
    </div>
  );
};

export default CropIrrigationSelection;
