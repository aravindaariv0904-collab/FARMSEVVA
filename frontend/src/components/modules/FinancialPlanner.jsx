import React from 'react';

const FinancialPlanner = ({ onBack }) => {
  const budget = [
    { item: 'Seeds', cost: '₹5,000', trend: '-200', type: 'Buy' },
    { item: 'Fertilizers', cost: '₹12,400', trend: '+1,500', type: 'Invest' },
    { item: 'Irrigation', cost: '₹3,500', trend: 'Fixed', type: 'Utility' },
    { item: 'Labor', cost: '₹18,000', trend: '+2,000', type: 'Expert' }
  ];

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Finance Planner</h2>
      </div>

      <div style={{ paddingBottom: '2rem' }}>
        <div className="dash-card full-width" style={{ background: 'linear-gradient(135deg, rgba(82, 130, 246, 0.1), rgba(16, 185, 129, 0.1))', border: '1px solid var(--info)', marginBottom: '1.5rem' }}>
          <p className="label" style={{ color: 'var(--info)' }}>ESTIMATED SEASON PROFIT</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0' }}>₹1,85,000</h1>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>PROFITED: 65% ↑</p>
        </div>

        <p className="label" style={{ color: 'var(--text-dim)', margin: '1rem 0' }}>BUDGET BREAKDOWN</p>
        {budget.map(b => (
          <div key={b.item} className="mandi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 800 }}>{b.item}</p>
              <p style={{ fontSize: '0.6rem', opacity: 0.5 }}>{b.type}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 800 }}>{b.cost}</p>
              <p style={{ fontSize: '0.6rem', color: b.trend.includes('-') ? 'var(--primary)' : 'var(--warning)' }}>{b.trend}</p>
            </div>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn-premium btn-primary" style={{ flex: 1, padding: '1rem' }}>Log Expense</button>
          <button className="btn-premium btn-secondary" style={{ flex: 1, padding: '1rem' }}>Export PDF</button>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanner;
