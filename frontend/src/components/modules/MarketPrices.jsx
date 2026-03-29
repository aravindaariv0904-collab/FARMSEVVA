import React, { useState } from 'react';

const MarketPrices = ({ onBack }) => {
  const [prices, setPrices] = useState([
    { crop: 'Cotton', price: '₹6,450', trend: '+120', status: 'Up' },
    { crop: 'Chilli', price: '₹18,200', trend: '+850', status: 'Up' },
    { crop: 'Paddy', price: '₹2,100', trend: '-20', status: 'Down' }
  ]);

  const [mandis, setMandis] = useState([
    { name: 'Guntur APMC', dist: '5km', price: '₹18,500', high: true, phone: '+919876543210' },
    { name: 'Vijayawada Market', dist: '32km', price: '₹18,200', high: false, phone: '+919876543211' }
  ]);

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Market Pulse</h2>
      </div>

      <div style={{ paddingBottom: '2rem' }}>
        <p className="label" style={{ color: 'var(--secondary)' }}>LIVE MANDI PRICES</p>
        <div style={{ margin: '1rem 0' }}>
          {prices.map(p => (
            <div key={p.crop} className="mandi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{p.crop}</h4>
                <p style={{ fontSize: '0.65rem', opacity: 0.5 }}>PER QUINTAL</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{p.price}</p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: p.status === 'Up' ? 'var(--primary)' : 'var(--accent)' }}>
                  {p.status === 'Up' ? '▲' : '▼'} {p.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="label" style={{ color: 'var(--info)' }}>BEST NEARBY MANDI</p>
        <div style={{ marginTop: '1rem' }}>
          {mandis.map(m => (
            <div key={m.name} className="mandi-card" style={{ background: m.high ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-glass)', borderColor: m.high ? 'var(--primary)' : 'var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontWeight: 800 }}>{m.name}</h4>
                  <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{m.dist} away</p>
                </div>
                <div>
                   <p style={{ fontSize: '1.1rem', fontWeight: 800, color: m.high ? 'var(--primary)' : 'white' }}>{m.price}</p>
                   {m.high && <span style={{ fontSize: '0.55rem', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>HIGHEST RATE</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button className="btn-premium btn-primary" onClick={() => window.location.href=`tel:${m.phone}`} style={{ flex: 1, padding: '0.75rem', fontSize: '0.8rem' }}>📞 Call Mandi</button>
                <button className="btn-premium btn-secondary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.8rem' }}>📍 Location</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
