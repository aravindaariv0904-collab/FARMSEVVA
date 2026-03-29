import React from 'react';
import * as turf from '@turf/turf';

const ControlPanel = ({ 
  position, 
  accuracy, 
  status, 
  boundary, 
  onResetLocation, 
  onSave 
}) => {
  // Area calculation logic (if boundary is present)
  let areaText = '';
  if (boundary && boundary.geometry && boundary.geometry.coordinates) {
    const areaSqM = turf.area(boundary);
    const areaAcres = (areaSqM * 0.000247105).toFixed(2);
    const areaHectares = (areaSqM * 0.0001).toFixed(2);
    areaText = `${areaAcres} ac / ${areaHectares} ha`;
  }

  // Determine status class
  const getStatusClass = () => {
    if (status.includes('High')) return 'status-high';
    if (status.includes('Medium')) return 'status-medium';
    if (status.includes('Manual')) return 'status-high';
    return 'status-low';
  };

  return (
    <div className="floating-overlay">
      <div className="glass-panel animate-in" style={{ padding: '2rem', borderRadius: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '1.5rem', 
            background: 'linear-gradient(135deg, var(--primary), var(--info))', 
            width: '50px', 
            height: '50px', 
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
          }}>🛰️</div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Grid Mapping</h3>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>Spatial Intelligence Node</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <p className="label" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>LATITUDE</p>
            <p className="value" style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{position?.latitude.toFixed(6) || '--'}</p>
          </div>
          <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <p className="label" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>LONGITUDE</p>
            <p className="value" style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{position?.longitude.toFixed(6) || '--'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>PRECISION STATUS</span>
          <span className={`status-badge ${getStatusClass()}`} style={{ fontSize: '0.6rem' }}>
            {status} ({accuracy?.toFixed(1) || '--'}m)
          </span>
        </div>

        {areaText && (
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))', padding: '1.25rem', borderRadius: '20px', border: '1px dashed var(--primary)', marginBottom: '1.5rem' }}>
            <p className="label" style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>CALCULATED LAND AREA</p>
            <p className="value" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>{areaText}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="btn-premium btn-secondary" onClick={onResetLocation}>
            🎯 Recalibrate GPS
          </button>
          <button className="btn-premium btn-primary" onClick={onSave} disabled={!boundary} style={{ height: '56px', fontSize: '1rem' }}>
            Confirm & Save Field <span>📦</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
