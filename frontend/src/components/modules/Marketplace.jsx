import React from 'react';

const Marketplace = ({ onBack }) => {
  const categories = ['All', 'Seeds', 'Fertilizers', 'Tools', 'Irrigation'];
  const [activeCat, setActiveCat] = React.useState('All');
  
  const products = [
    { title: 'Super Guntur Chilli Seeds', price: '₹1,200', tag: 'AI Recommended', icon: '🌱', cat: 'Seeds' },
    { title: 'Organic NPK Fertilizer', price: '₹4,500', tag: 'Soil Match', icon: '🧪', cat: 'Fertilizers' },
    { title: 'Drip Irrigation Kit', price: '₹12,400', tag: 'Subsidy Ready', icon: '💧', cat: 'Irrigation' },
    { title: 'Neem Oil (Leaf Doc)', price: '₹600', tag: 'Pest Relief', icon: '🌿', cat: 'Fertilizers' },
    { title: 'Smart Soil Sensor', price: '₹8,900', tag: 'IoT Sync', icon: '🛰️', cat: 'Tools' }
  ];

  const filtered = activeCat === 'All' ? products : products.filter(p => p.cat === activeCat);

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Marketplace</h2>
      </div>

      <div style={{ padding: '0 1rem 3rem' }}>
        <p className="label" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>SHOP BY CATEGORY</p>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1.5rem', scrollbarWidth: 'none' }}>
           {categories.map(c => (
             <button 
               key={c}
               onClick={() => setActiveCat(c)}
               style={{ 
                 whiteSpace: 'nowrap', 
                 padding: '0.6rem 1.25rem', 
                 borderRadius: '12px', 
                 background: activeCat === c ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                 border: '1px solid',
                 borderColor: activeCat === c ? 'var(--accent)' : 'var(--border-glass)',
                 color: 'white',
                 fontWeight: 700,
                 fontSize: '0.75rem'
               }}
             >{c}</button>
           ))}
        </div>

        <div className="card-grid">
          {filtered.map(p => (
            <div key={p.title} className="dash-card" style={{ padding: '1rem', height: '260px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ background: 'rgba(255,255,255,0.02)', height: '100px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '1rem', border: '1px solid var(--border-glass)' }}>
                 {p.icon}
               </div>
               <div style={{ flex: 1 }}>
                 <p style={{ fontSize: '0.55rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase' }}>{p.tag}</p>
                 <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginTop: '0.25rem' }}>{p.title}</h4>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                 <p style={{ fontWeight: 800, fontSize: '1rem' }}>{p.price}</p>
                 <button className="btn-premium btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}>Add</button>
               </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '24px', border: '1px solid var(--info)', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1 }}>🚚</div>
           <p className="label" style={{ color: 'var(--info)', marginBottom: '0.5rem' }}>LOCAL DELIVERY HUB</p>
           <p style={{ fontWeight: 800 }}>Guntur Distribution Center</p>
           <p style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.4rem' }}>Status: <span style={{ color: 'var(--primary)' }}>● Active</span> | Next Truck: Today, 4:00 PM</p>
           <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', fontSize: '0.7rem' }}>Track Order #FS-9281</button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
