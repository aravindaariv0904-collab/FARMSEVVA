import React, { useState } from 'react';

const CropCalendar = ({ onBack }) => {
  const [tasks, setTasks] = useState([
    { d: 1, type: 'Soil', task: 'Land Preparation', detail: 'Plough the soil twice for aerification.', done: true },
    { d: 3, type: 'Seed', task: 'Sowing/Planting', detail: 'Sow at 2-inch depth with 3-foot spacing.', done: true },
    { d: 15, type: 'Water', task: 'First Irrigation', detail: 'Ensure 50% soil saturation.', done: false },
    { d: 30, type: 'Nutri', task: 'NPK Application', detail: 'Mix 10:26:26 with organic compost.', done: false },
    { d: 45, type: 'Pest', task: 'Pest Scouting', detail: 'Scan leaves with Pest Diagnosis tool.', done: false },
    { d: 90, type: 'Harvest', task: 'Final Harvest', detail: 'Collect crop at 12% moisture level.', done: false }
  ]);

  const toggleTask = (idx) => {
    const newTasks = [...tasks];
    newTasks[idx].done = !newTasks[idx].done;
    setTasks(newTasks);
  };

  return (
    <div className="screen-container animate-in">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Crop Calendar</h2>
      </div>

      <div style={{ paddingBottom: '2rem' }}>
        {tasks.map((t, i) => (
          <div 
            key={i} 
            className={`calendar-day ${t.done ? 'done' : ''}`}
            onClick={() => toggleTask(i)}
            style={{ borderLeftWidth: '6px', borderLeftColor: 
               t.type === 'Soil' ? '#8b5e34' : 
               t.type === 'Seed' ? '#10b981' :
               t.type === 'Water' ? '#3b82f6' : 
               t.type === 'Nutri' ? '#f59e0b' : '#ef4444' }}
          >
            <div className="day-num">
              <span>DAY</span>
              <span style={{ fontSize: '1rem' }}>{t.d}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <h4 style={{ fontWeight: 700 }}>{t.task}</h4>
                {t.done && <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>✅ DONE</span>}
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{t.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropCalendar;
