import React from 'react';

const FarmerDetails = ({ onNext, data, setData }) => (
  <div className="screen-card animate-in" style={{ padding: '3.5rem 2.5rem' }}>
    <h1 className="title-glow">Personal Profile</h1>
    <p className="subtitle">Tell us about yourself to tailor your AI experience.</p>
    
    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      <div>
        <label className="label-top" style={{ color: 'var(--primary)' }}>Full Name</label>
        <input 
          type="text" 
          className="input-premium" 
          placeholder="e.g. Ram Naidu" 
          value={data.name || ''}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label-top" style={{ color: 'var(--info)' }}>Age</label>
          <input 
            type="number" 
            className="input-premium" 
            placeholder="45" 
            value={data.age || ''}
            onChange={(e) => setData({ ...data, age: e.target.value })}
          />
        </div>
        <div>
          <label className="label-top" style={{ color: 'var(--secondary)' }}>Experience (Yrs)</label>
          <input 
            type="number" 
            className="input-premium" 
            placeholder="20" 
            value={data.exp || ''}
            onChange={(e) => setData({ ...data, exp: e.target.value })}
          />
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p style={{ fontSize: '0.7rem', opacity: 0.5, fontStyle: 'italic' }}>* This data helps AI calibrate crop yields for your expertise level.</p>
      </div>
    </div>

    <button className="btn-premium btn-primary" onClick={() => onNext(3)} style={{ marginTop: '2.5rem', width: '100%', height: '56px' }}>
      Continue to Field Setup <span>🛰️</span>
    </button>
  </div>
);

export default FarmerDetails;
