import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import ControlPanel from './components/ControlPanel';
import HomeDashboard from './components/dashboard/HomeDashboard';
import SplashScreen from './components/onboarding/SplashScreen';
import LanguageSelector from './components/onboarding/LanguageSelector';
import AuthView from './components/onboarding/AuthView';
import FarmerDetails from './components/onboarding/FarmerDetails';
import SoilInputHub from './components/onboarding/SoilInputHub';
import CropCalendar from './components/modules/CropCalendar';
import MarketPrices from './components/modules/MarketPrices';
import AIChat from './components/modules/AIChat';
import WeatherForecast from './components/modules/WeatherForecast';
import FinancialPlanner from './components/modules/FinancialPlanner';
import CheckInConversation from './components/modules/CheckInConversation';
import SoilReport from './components/modules/SoilReport';
import PestDiagnosis from './components/modules/PestDiagnosis';
import GovtSchemes from './components/modules/GovtSchemes';
import Marketplace from './components/modules/Marketplace';
import { useHighAccuracyGPS } from './hooks/useHighAccuracyGPS';
import CropIrrigationSelection from './components/onboarding/CropIrrigationSelection';
import LandingPage from './components/LandingPage';
import Profile from './components/modules/Profile';

// --- AI Processing Screen (Screen 9) ---

const AIProcessing = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Analyzing Soil Profile (SoilGrids)...",
    "Fetching Weather Forecast (OpenWeather)...",
    "Analyzing Market Price Trends...",
    "Matching Crops to Soil N-P-K...",
    "Calculating Financial ROI...",
    "Drafting Scheme Eligibility...",
    "Synthesizing Terra AI Reasoning...",
    "Generating Farming Calendar..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { 
          clearInterval(timer); 
          setTimeout(onComplete, 1200); 
          return 100; 
        }
        const nextP = p + 0.6;
        setCurrentStep(Math.floor((nextP / 100) * steps.length));
        return nextP;
      });
    }, 45);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="screen-card animate-in text-center" style={{ padding: '4rem 2.5rem', width: '100%', maxWidth: '480px', borderRadius: '48px', position: 'relative', overflow: 'hidden' }}>
      <div className="pulse-glow" style={{ position: 'absolute', top: '10%', right: '10%', width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(50px)', opacity: 0.1 }}></div>
      <div className="pulse-glow" style={{ position: 'absolute', bottom: '10%', left: '10%', width: '100px', height: '100px', background: 'var(--info)', filter: 'blur(50px)', opacity: 0.1 }}></div>
      <h1 className="title-glow" style={{ fontSize: '2rem', fontWeight: 900 }}>Terra AI Synthesizing</h1>
      <p className="subtitle">Merging satellite layers and localized analytics for your grid.</p>
      <div style={{ position: 'relative', margin: '3.5rem 0', display: 'flex', justifyContent: 'center' }}>
         <div className="neural-circle" style={{ 
            width: '140px', height: '140px', border: '2px dashed var(--primary)', borderRadius: '50%', 
            animation: 'spin 15s linear infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.05)'
         }}>
           <div style={{ fontSize: '4.5rem', animation: 'float 4s ease-in-out infinite' }}>🧠</div>
         </div>
      </div>
      <div style={{ marginBottom: '2.5rem', minHeight: '60px' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>{steps[Math.min(currentStep, steps.length - 1)]}</p>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--info))', boxShadow: '0 0 20px var(--primary-glow)' }}></div>
      </div>
    </div>
  );
};

// --- I18n Engine (12 Languages Production Set) ---
const translations = {
  en: { 
    welcome: "Namaste!", grid: "GUNTUR GRID-82", soil: "Soil Health", profit: "Estimated Profit",
    chat: "Chat", cycle: "Cycle", profile: "Profile", home: "Home",
    start: "Start Onboarding", analyze: "Analyze Soil", confirm: "Confirm & Plan",
    recalibrate: "Recalibrate GPS", soil_type: "SOIL TYPE", ph: "pH LEVEL",
    marketplace: "Market", govt: "Schemes"
  },
  hi: { 
    welcome: "नमस्ते!", grid: "गुंटूर ग्रिड-82", soil: "मिट्टी का स्वास्थ्य", profit: "अनुमानित लाभ",
    chat: "चैट", cycle: "चक्र", profile: "प्रोफ़ाइल", home: "होम",
    start: "ऑनबोर्डिंग शुरू करें", analyze: "मिट्टी का विश्लेषण", confirm: "पुष्टि करें",
    recalibrate: "जीपीएस रीसेट करें", soil_type: "मिट्टी का प्रकार", ph: "पीएच स्तर",
    marketplace: "बाज़ार", govt: "योजनाएं"
  },
  te: { 
    welcome: "నమస్తే!", grid: "గుంటూరు గ్రిడ్-82", soil: "నేల ఆరోగ్యం", profit: "అంచనా లాభం",
    chat: "చాట్", cycle: "చక్రం", profile: "ప్రొఫైల్", home: "హోమ్",
    start: "ప్రారంభించండి", analyze: "నేలను విశ్లేషించు", confirm: "ధృవీకరించండి",
    recalibrate: "GPS రీసెట్", soil_type: "నేల రకం", ph: "pH స్థాయి",
    marketplace: "మార్కెట్", govt: "పథకాలు"
  },
  ta: { 
    welcome: "வணக்கம்!", grid: "குண்டூர் கிரிட்-82", soil: "மண் ஆரோக்கியம்", profit: "மதிப்பிடப்பட்ட லாபம்",
    chat: "அரட்டை", cycle: "சுழற்சி", profile: "சுயவிவரம்", home: "முகப்பு",
    start: "தொடங்கவும்", analyze: "மண்ணை ஆராயுங்கள்", confirm: "உறுதிப்படுத்தவும்",
    recalibrate: "GPS மீள்அமை", soil_type: "மண் வகை", ph: "pH அளவு"
  },
  kn: { 
    welcome: "ನಮಸ್ತೆ!", grid: "ಗುಂಟೂರು ಗ್ರಿಡ್-82", soil: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ", profit: "ಅಂದಾಜು ಲಾಭ",
    chat: "ಚಾಟ್", cycle: "ಚಕ್ರ", profile: "ಪ್ರೊಫೈಲ್", home: "ಮುಖಪುಟ", marketplace: "ಮಾರುಕಟ್ಟೆ", govt: "ಯೋಜನೆಗಳು"
  },
  mr: { 
    welcome: "नमस्ते!", grid: "गुंटूर ग्रिड-82", soil: "मातीचे आरोग्य", profit: "अंदाजित नफा",
    chat: "चॅट", cycle: "चक्र", profile: "प्रोफाइल", home: "होम"
  },
  bn: { 
    welcome: "নমস্তে!", grid: "গুন্টুর গ্রিড-82", soil: "মাটির স্বাস্থ্য", profit: "আনুমানিক লাভ",
    chat: "চ্যাট", cycle: "চক্র", profile: "প্রোফাইল", home: "হোম"
  },
  ml: { 
    welcome: "നമസ്‌കാരം!", grid: "ഗുണ്ടൂർ ഗ്രിഡ്-82", soil: "മണ്ണിന്റെ ആരോഗ్యం", profit: "പ്രതീക്ഷിക്കുന്ന ലാഭം", marketplace: "ചന്ത", govt: "പദ്ധതികൾ"
  },
  gu: { 
    welcome: "નમસ્તે!", grid: "ગુંટુર ગ્રિડ-82", soil: "જમીનનું સ્વાસ્થ્ય", profit: "અંદાજિત નફો", marketplace: "બજાર", govt: "યોજનાઓ"
  },
  or: { 
    welcome: "ନମସ୍କାର!", grid: "ଗୁଣ୍ଟୁର ଗ୍ରୀଡ୍-82", soil: "ମାଟି ସ୍ୱାସ୍ଥ୍ୟ", profit: "ଆନୁମାନିକ ଲାଭ"
  },
  pa: { 
    welcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!", grid: "ਗੁੰਟੂਰ ਗ੍ਰਿਡ-82", soil: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ", profit: "ਅੰਦਾਜ਼ਨ ਮੁਨਾਫਾ"
  },
  ur: { 
    welcome: "سلام!", grid: "گنٹور گرڈ-82", soil: "مٹی کی صحت", profit: "تخمینی منافع"
  }
};

const t = (key, lang) => (translations[lang] || translations['en'])[key] || (translations['en'][key] || key);

function App() {
  const [appState, setAppState] = useState('landing'); 
  const [currentScreen, setCurrentScreen] = useState(1);
  const [activeModule, setActiveModule] = useState('Home');
  const [data, setData] = useState({
    lang: 'en', 
    name: '', 
    email: '',
    age: '',
    exp: '',
    location: null, 
    boundary: null, 
    soilMethod: 'gps', 
    farmingStyle: 'Single Crop', 
    irrigation: 'Drip', 
    crops: []
  });

  const { position: gpsPos, accuracy, status, stable } = useHighAccuracyGPS();

  const handleNext = (screen) => setCurrentScreen(screen);
  const handleBack = () => setCurrentScreen(prev => {
     if (prev === 2.5) return 2;
     if (prev === 3) return 2.5;
     if (prev === 5) return 3;
     if (prev === 6) return 5;
     return prev - 1;
  });

  const resetAll = () => {
    setAppState('landing');
    setCurrentScreen(1);
    setActiveModule('Home');
    setData({
      lang: 'en', 
      name: '', 
      email: '',
      age: '',
      exp: '',
      location: null, 
      boundary: null, 
      soilMethod: 'gps', 
      farmingStyle: 'Single Crop', 
      irrigation: 'Drip', 
      crops: []
    });
  };

  const renderOnboarding = () => {
    switch(currentScreen) {
      case 1: return <LanguageSelector onNext={handleNext} data={data} setData={setData} />;
      case 2: return <AuthView onNext={handleNext} onBack={handleBack} data={data} setData={setData} />;
      case 2.5: return <FarmerDetails onNext={() => handleNext(3)} data={data} setData={setData} />;
      case 3: 
        return (
          <div className="map-view-container animate-in">
            {!stable && !data.location && (
              <div className="stabilizing-overlay">
                <div className="glass-panel text-center" style={{ padding: '3rem', width: '100%', maxWidth: '380px', borderRadius: '40px' }}>
                  <div className="spinner" style={{ width: '60px', height: '60px', margin: '0 auto' }}></div>
                  <h2 className="title-glow" style={{ fontSize: '1.5rem', marginTop: '1.5rem' }}>Stabilizing GPS...</h2>
                  <p className="status-badge status-medium" style={{ display: 'inline-block' }}>{status}</p>
                </div>
              </div>
            )}
            <MapComponent 
              gpsPosition={data.location || gpsPos} accuracy={!!data.location ? 0 : accuracy}
              onManualMove={(pos) => setData({ ...data, location: pos })}
              onBoundaryUpdate={(b) => setData({ ...data, boundary: b })}
              autoCenter={!data.location} isManual={!!data.location}
            />
            <ControlPanel 
              position={data.location || gpsPos} 
              accuracy={!!data.location ? 0 : accuracy}
              status={!!data.location ? 'Fixed (User)' : status}
              boundary={data.boundary}
              onResetLocation={() => setData({ ...data, location: null })}
              onSave={() => handleNext(5)}
            />
          </div>
        );
      case 5: return <SoilInputHub onComplete={() => handleNext(6)} onBack={() => handleNext(3)} data={data} setData={setData} />;
      case 6: return <CropIrrigationSelection onNext={() => setAppState('processing')} onBack={() => handleNext(5)} data={data} setData={setData} />;
      default: return <LanguageSelector onNext={handleNext} data={data} setData={setData} />;
    }
  };

  const renderModule = () => {
    switch(activeModule) {
      case 'Home': return <HomeDashboard user={data} farm={data} onNavigate={setActiveModule} t={(k) => t(k, data.lang)} />;
      case 'Calendar': return <CropCalendar onBack={() => setActiveModule('Home')} />;
      case 'Prices': return <MarketPrices onBack={() => setActiveModule('Home')} />;
      case 'AIChat': return <AIChat onBack={() => setActiveModule('Home')} />;
      case 'Weather': return <WeatherForecast onBack={() => setActiveModule('Home')} />;
      case 'Profile': return <Profile user={data} onBack={() => setActiveModule('Home')} onReset={resetAll} t={(k) => t(k, data.lang)} />;
      case 'Govt': return <GovtSchemes onBack={() => setActiveModule('Home')} />;
      case 'Soil': return <SoilReport onBack={() => setActiveModule('Home')} />;
      case 'Diagnosis': return <PestDiagnosis onBack={() => setActiveModule('Home')} onNavigate={setActiveModule} />;
      case 'Marketplace': return <Marketplace onBack={() => setActiveModule('Home')} />;
      case 'Finance': return <FinancialPlanner onBack={() => setActiveModule('Home')} />;
      case 'CheckIn': return <CheckInConversation onBack={() => setActiveModule('Home')} />;
      default: return <HomeDashboard user={data} farm={data} onNavigate={setActiveModule} t={(k) => t(k, data.lang)} />;
    }
  };

  if (appState === 'landing') return <LandingPage onStart={() => setAppState('splash')} />;
  if (appState === 'splash') return <SplashScreen onComplete={() => setAppState('onboarding')} />;
  
  if (appState === 'processing') {
    return (
      <div className="app-container">
        <main id="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AIProcessing onComplete={() => setAppState('app')} />
        </main>
      </div>
    );
  }

  if (appState === 'app') {
    return (
      <div className="app-shell" style={{ direction: data.lang === 'ur' ? 'rtl' : 'ltr' }}>
        <main className="screen-container">{renderModule()}</main>
        {['Home', 'AIChat', 'Calendar', 'Profile'].includes(activeModule) && (
          <nav className="bottom-nav">
             <div className={`nav-item ${activeModule === 'Home' ? 'active' : ''}`} onClick={() => setActiveModule('Home')}><span style={{fontSize:'1.5rem'}}>🏠</span><span>{t('home', data.lang)}</span></div>
             <div className={`nav-item ${activeModule === 'AIChat' ? 'active' : ''}`} onClick={() => setActiveModule('AIChat')}><span style={{fontSize:'1.5rem'}}>💬</span><span>{t('chat', data.lang)}</span></div>
             <div className={`nav-item ${activeModule === 'Calendar' ? 'active' : ''}`} onClick={() => setActiveModule('Calendar')}><span style={{fontSize:'1.5rem'}}>📅</span><span>{t('cycle', data.lang)}</span></div>
             <div className={`nav-item ${activeModule === 'Profile' ? 'active' : ''}`} onClick={() => setActiveModule('Profile')}><span style={{fontSize:'1.5rem'}}>👤</span><span>{t('profile', data.lang)}</span></div>
          </nav>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <main id="app-shell" style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        {renderOnboarding()}
      </main>
    </div>
  );
}

export default App;
