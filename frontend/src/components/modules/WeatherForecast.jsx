import React from 'react';

const WeatherForecast = ({ onBack }) => {
  const forecast = [
    { m: 'APR', rain: '120mm', humidity: '45%', risk: 'Low', status: 'Optimal' },
    { m: 'MAY', rain: '85mm', humidity: '38%', risk: 'Medium', status: 'Heatwave' },
    { m: 'JUN', rain: '240mm', humidity: '72%', risk: 'High', status: 'Monsoon' },
    { m: 'JUL', rain: '310mm', humidity: '85%', risk: 'High', status: 'Heavy Rain' }
  ];

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">4-Month Forecast</h2>
      </div>

      <div style={{ paddingBottom: '2rem' }}>
        <p className="label" style={{ color: 'var(--info)' }}>CLIMATE TELEMETRY</p>
        <div style={{ marginTop: '1.5rem' }}>
          {forecast.map(f => (
            <div key={f.m} className="mandi-card" style={{ borderLeft: '6px solid', borderLeftColor: f.risk === 'Low' ? 'var(--primary)' : f.risk === 'Medium' ? 'var(--secondary)' : 'var(--warning)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{f.m}</h1>
                   <p className="status-badge" style={{ display: 'inline-block', marginTop: '0.25rem', background: f.risk === 'Low' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: f.risk === 'Low' ? 'var(--primary)' : 'var(--warning)', borderColor: f.risk === 'Low' ? 'var(--primary)' : 'var(--warning)', border: '1px solid' }}>{f.status}</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>RAINFALL EST.</p>
                   <p style={{ fontWeight: 800, fontSize: '1.25rem' }}>{f.rain}</p>
                 </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                <div>
                  <p className="label" style={{ fontSize: '0.55rem' }}>HUMIDITY</p>
                  <p style={{ fontWeight: 700 }}>{f.humidity}</p>
                </div>
                <div>
                  <p className="label" style={{ fontSize: '0.55rem' }}>PEST RISK</p>
                  <p style={{ fontWeight: 700, color: f.risk === 'High' ? 'var(--warning)' : 'white' }}>{f.risk}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-premium btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>🔔 Set Rain Alerts</button>
      </div>
    </div>
  );
};

export default WeatherForecast;
