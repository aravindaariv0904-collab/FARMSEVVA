import React, { useState } from 'react';

const CheckInConversation = ({ onBack }) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [step, setStep] = useState(0);

  const checkIns = [
    { week: 1, q: "How did the sowing go? Any germination issues?", why: "Adjusts calendar if delayed" },
    { week: 3, q: "How does the crop look? Any unusual colour or growth?", why: "Early pest or deficiency detection" },
    { week: 6, q: "Did the recent rain help or cause waterlogging?", why: "Revises irrigation advice" },
    { week: 10, q: "Have you seen any insects or spots on the leaves?", why: "Triggers pest diagnosis flow" },
    { week: 14, q: "Crop looks close to maturity — how does it look to you?", why: "Adjusts harvest timing prediction" },
    { week: 'Post', q: "How was the yield? What price did you sell at?", why: "Improves next season recommendations" }
  ];

  const currentQ = checkIns[step];

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Weekly Check-in</h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <p className="label" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>WEEK {currentQ.week.toString()}</p>
        
        <div style={{ fontSize: '5rem', marginBottom: '2rem', animation: 'logoIn 1.5s infinite alternate' }}>🧠</div>
        
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', padding: '2rem', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', width: '100%' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.6', marginBottom: '1rem' }}>"{currentQ.q}"</p>
          <p style={{ fontSize: '0.7rem', opacity: 0.5, fontStyle: 'italic', marginBottom: '2rem' }}>Terra AI is asking this to {currentQ.why}.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button className="btn-premium btn-secondary" onClick={() => setStep(s => (s + 1) % checkIns.length)} style={{ padding: '1rem', fontSize: '0.85rem' }}>It went great!</button>
            <button className="btn-premium btn-primary" onClick={() => setStep(s => (s + 1) % checkIns.length)} style={{ padding: '1rem', fontSize: '0.85rem' }}>Need help...</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', opacity: 0.4 }}>Monday Check-in builds your seasonal relationship with Terra AI.</p>
      </div>
    </div>
  );
};

export default CheckInConversation;
