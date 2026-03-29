import React, { useState, useRef, useEffect } from 'react';

const AIChat = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am Terra AI. I have analyzed your farm telemetry. How can I guide you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const capabilities = [
    { q: "My soil test shows low zinc — what should I do?", r: "Apply zinc sulphate 25kg per acre before next irrigation. Also check for deficiency symptoms on young leaves.", icon: "🧬", label: "Soil" },
    { q: "Which crop should I plant this October in my black soil?", r: "Based on your soil and Marathwada location, Cotton and Soybean are top picks. Cotton expected Rs.6000 per quintal this season.", icon: "🌱", label: "Crop" },
    { q: "My tomato leaves are turning yellow and curling", r: "Photo shows signs of Tomato Leaf Curl Virus spread by whiteflies. Use yellow sticky traps + neem oil spray immediately.", icon: "🩺", label: "Pest" },
    { q: "Should I spray today or will it rain?", r: "According to IMD forecast, 60% chance of rain tomorrow afternoon. Delay spray to day after for best results.", icon: "🌦️", label: "Rain" },
    { q: "When is the best time to sell my onions this year?", r: "Onion prices historically peak in March-April. Current trend shows rising prices. Consider holding stock 3 more weeks.", icon: "📈", label: "Market" },
    { q: "Am I eligible for PM-KISAN? How do I apply?", r: "Based on your farm size and location, you are eligible. Next installment is due in December. Open PM-KISAN portal to verify your Aadhaar details.", icon: "🏦", label: "Scheme" },
    { q: "What should I do in my wheat field today?", r: "Day 32 of wheat crop — today is irrigation day. Water to a depth of 5cm. Tomorrow watch for yellow rust symptoms.", icon: "📅", label: "Task" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const userMsg = text || input;
    if (!userMsg) return;

    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    // Find the best response from capabilities or default
    const matched = capabilities.find(c => userMsg.toLowerCase().includes(c.label.toLowerCase()) || userMsg.includes(c.q));
    const responseText = matched ? matched.r : "Analyzing your localized data node... Yes, based on current soil moisture and market trends, I suggest optimized irrigation for your Guntur plot.";

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot' }]);
    }, 1500);
  };

  return (
    <div className="screen-container animate-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="module-header" style={{ marginBottom: '1rem' }}>
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="title-glow">Terra AI Chat</h2>
      </div>

      {/* Quick Suggestions Scroll */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0.5rem 0 1.5rem', whiteSpace: 'nowrap', maskImage: 'linear-gradient(to right, black 85%, transparent)' }}>
        {capabilities.map(c => (
           <button 
             key={c.label} 
             onClick={() => handleSend(c.q)}
             style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'white', padding: '0.6rem 1rem', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
           >
             <span>{c.icon}</span> {c.label}
           </button>
        ))}
      </div>

      {/* Chat History */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map(m => (
          <div key={m.id} style={{ alignSelf: m.sender === 'bot' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
            <div style={{ 
              background: m.sender === 'bot' ? 'rgba(255,255,255,0.05)' : 'var(--primary)', 
              color: 'white', 
              padding: '1.1rem 1.4rem', 
              borderRadius: m.sender === 'bot' ? '24px 24px 24px 4px' : '24px 24px 4px 24px', 
              border: m.sender === 'bot' ? '1px solid var(--border-glass)' : 'none',
              boxShadow: m.sender === 'bot' ? 'none' : '0 8px 24px rgba(16, 185, 129, 0.2)'
            }}>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 500 }}>{m.text}</p>
            </div>
            <p style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '0.4rem', textAlign: m.sender === 'bot' ? 'left' : 'right', letterSpacing: '1px', fontWeight: 700 }}>
              {m.sender === 'bot' ? 'TERRA AI • CORE PROTOCOL' : 'HYPER-LOCALIZED USER'}
            </p>
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-glass)', padding: '1rem', borderRadius: '20px', display: 'flex', gap: '4px' }}>
            <div className="dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
            <div className="dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></div>
            <div className="dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div style={{ padding: '1.5rem 0', marginTop: 'auto' }}>
        <div style={{ background: 'var(--bg-card)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-glass)', borderRadius: '28px', padding: '0.6rem', display: 'flex', gap: '0.6rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <button style={{ width: '52px', height: '52px', borderRadius: '22px', background: 'var(--info)', border: 'none', color: 'white', fontSize: '1.4rem', cursor: 'pointer', transition: '0.3s' }}>🎙️</button>
          <input 
            className="input-premium" 
            placeholder="Ask Terra AI anything..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ border: 'none', background: 'transparent', height: '52px', padding: '0 1rem', fontSize: '1rem', fontWeight: 500 }}
          />
          <button 
             onClick={() => handleSend()}
             style={{ width: '52px', height: '52px', borderRadius: '22px', background: 'var(--primary)', border: 'none', color: 'white', fontSize: '1.4rem', cursor: 'pointer', transition: '0.3s' }}>
              ✈️
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
