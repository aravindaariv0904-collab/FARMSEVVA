import React from 'react';

const Profile = ({ onBack, user, onReset, t }) => {
  return (
    <div className="screen-container animate-in" style={{ paddingBottom: '6rem' }}>
      <div className="module-header" style={{ marginBottom: '2rem' }}>
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">{t('profile')}</h2>
      </div>

      <div style={{ padding: '0 0.5rem' }}>
        {/* User Info Header */}
        <div className="dash-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--primary)' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '30px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>👩‍🌾</div>
           <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{user.name || 'Ram Naidu'}</h3>
              <p style={{ opacity: 0.6, fontSize: '0.8rem', fontWeight: 700 }}>Village: Guntur Grid-82</p>
           </div>
           <button className="btn-premium btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>Edit Info</button>
        </div>

        {/* Farm Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { l: 'ACREAGE', v: '2.5 AC' },
            { l: 'SINCE', v: '2023' },
            { l: 'YIELD', v: '+24%' }
          ].map(s => (
            <div key={s.l} className="dash-card" style={{ textAlign: 'center', padding: '1rem' }}>
               <p style={{ fontSize: '0.55rem', fontWeight: 800, opacity: 0.4, marginBottom: '4px' }}>{s.l}</p>
               <p style={{ fontWeight: 900, fontSize: '1rem' }}>{s.v}</p>
            </div>
          ))}
        </div>

        <h3 className="label" style={{ marginBottom: '1.25rem', opacity: 0.6 }}>CORE SETTINGS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { tKey: 'cycle', d: 'View past seasons', i: '📦' },
            { tKey: 'prices', d: 'Expenses & Profits', i: '💸' },
            { tKey: 'chat', d: 'WhatsApp, SMS, Push', i: '🔔' },
            { tKey: 'profile', d: 'Choose from 12 languages', i: '🌍' }
          ].map(s => (
            <div key={s.tKey} className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
               <div style={{ fontSize: '1.5rem' }}>{s.i}</div>
               <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>{t(s.tKey)}</h4>
                  <p style={{ opacity: 0.5, fontSize: '0.75rem' }}>{s.d}</p>
               </div>
               <div style={{ opacity: 0.3 }}>→</div>
            </div>
          ))}
        </div>

        <button 
          className="btn-premium btn-secondary" 
          onClick={onReset}
          style={{ width: '100%', marginTop: '3rem', padding: '1.25rem', borderRadius: '20px', color: 'var(--warning)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          Sign Out & Reset Session 🗑️
        </button>
        
        <p style={{ textAlign: 'center', opacity: 0.3, marginTop: '2rem', fontSize: '0.7rem' }}>Farm Seeva v2.4.0 (Mar 2026 Core)</p>
      </div>
    </div>
  );
};

export default Profile;
