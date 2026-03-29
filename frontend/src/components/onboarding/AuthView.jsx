import React, { useState } from 'react';

const AuthView = ({ onNext, onBack, data, setData }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  return (
    <div className="screen-card animate-in" style={{ padding: '3.5rem 2.5rem' }}>
      <h1 className="title-glow">Secure Access</h1>
      <p className="subtitle">Enter your details to sync your farm telemetry across AI nodes.</p>
      
      <div style={{ textAlign: 'left', width: '100%', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label-top" style={{ color: 'var(--info)' }}>Registered Email</label>
          <input 
            type="email" 
            className="input-premium" 
            placeholder="farmer@seeva.com" 
            value={data.email || ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            style={{ fontSize: '1.1rem', padding: '1.25rem' }}
          />
        </div>

        {otpSent && (
          <div style={{ marginTop: '1.5rem', animation: 'slideUp 0.3s forwards' }}>
            <label className="label-top" style={{ color: 'var(--primary)' }}>Verification Code</label>
            <input 
              type="text" 
              className="input-premium" 
              placeholder="Enter 4-digit OTP" 
              maxLength={4}
              value={otpValue || ''}
              onChange={(e) => setOtpValue(e.target.value)}
              style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'var(--primary-glow)', letterSpacing: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 800 }} 
            />
            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--primary-light)', marginTop: '0.75rem', fontWeight: 600 }}>OTP SENT TO EMAIL</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        {!otpSent ? (
          <>
            <button className="btn-premium btn-secondary" onClick={onBack} style={{ flex: 1, height: '56px' }}>Back</button>
            <button className="btn-premium btn-primary" onClick={() => setOtpSent(true)} style={{ flex: 2, height: '56px' }}>Send Authentication Link</button>
          </>
        ) : (
          <>
            <button className="btn-premium btn-secondary" onClick={() => setOtpSent(false)} style={{ flex: 1, height: '56px' }}>Edit Email</button>
            <button className="btn-premium btn-primary" onClick={() => onNext(2.5)} style={{ flex: 2, height: '56px' }}>Secure Login 🛡️</button>
          </>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <p style={{ fontSize: '0.6rem', opacity: 0.4, fontStyle: 'italic' }}>Encryption active: AES-256 Cloud Protocol</p>
      </div>
    </div>
  );
};

export default AuthView;
