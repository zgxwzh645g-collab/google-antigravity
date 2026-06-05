import { useState } from 'react'
import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import { Search, Heart, Settings, X, ChevronDown, MapPin, Calendar, Users } from 'lucide-react';
import './App.css'
import { matches, colors } from './data';
function App() {
function App() {
  const [count, setCount] = useState(0)
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Persisted State
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('wm_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem('wm_predictions');
    return saved ? JSON.parse(saved) : {};
  });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('wm_theme');
    return saved ? JSON.parse(saved) : {
      bg: '#1a1a1a',
      nav: '#0f0f0f',
      card: '#242424'
    };
  });
  // Persist changes
  useEffect(() => {
    localStorage.setItem('wm_favorites', JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem('wm_predictions', JSON.stringify(predictions));
  }, [predictions]);
  useEffect(() => {
    localStorage.setItem('wm_theme', JSON.stringify(theme));
    document.documentElement.style.setProperty('--bg-color', theme.bg);
    document.documentElement.style.setProperty('--nav-color', theme.nav);
    document.documentElement.style.setProperty('--card-color', theme.card);
  }, [theme]);
  // Handlers
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };
  const handlePredictionChange = (matchId, teamIndex, value) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [teamIndex]: value
      }
    }));
  };
  // Filtering
  const filteredMatches = matches.filter(match => {
    if (showFavoritesOnly && !favorites.includes(match.id)) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchString = `${match.team1} ${match.team2} ${match.location} ${match.date}`.toLowerCase();
      if (!matchString.includes(query)) return false;
    }
    
    return true;
  });
  return (
  return (
    <div className="App">
    <div className="app-container">
      <div>
      <Navbar 
        <a href="https://vitejs.dev" target="_blank">
        searchQuery={searchQuery}
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        setSearchQuery={setSearchQuery}
        </a>
        showFavoritesOnly={showFavoritesOnly}
        <a href="https://reactjs.org" target="_blank">
        setShowFavoritesOnly={setShowFavoritesOnly}
          <img src={reactLogo} className="logo react" alt="React logo" />
        setIsSettingsOpen={setIsSettingsOpen}
        </a>
      />
      <main className="main-content">
        <h1 className="page-title">
          {showFavoritesOnly ? 'Ihre Favoriten' : 'WM 2026 Spielplan'}
        </h1>
        <div className="matches-grid">
          {filteredMatches.length > 0 ? (
            filteredMatches.map(match => (
              <MatchCard 
                key={match.id}
                match={match}
                isFavorite={favorites.includes(match.id)}
                toggleFavorite={() => toggleFavorite(match.id)}
                prediction={predictions[match.id] || { 1: '', 2: '' }}
                onPredictionChange={handlePredictionChange}
              />
            ))
          ) : (
            <div className="no-results">
              <p>Keine Spiele gefunden.</p>
            </div>
          )}
        </div>
      </main>
      <SettingsMenu 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
// Components
function Navbar({ searchQuery, setSearchQuery, showFavoritesOnly, setShowFavoritesOnly, setIsSettingsOpen }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">WM 2026</div>
      
      <div className="search-container">
        <Search size={20} color="rgba(255,255,255,0.5)" />
        <input 
          type="text" 
          placeholder="Suche nach Datum, Team oder Ort..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
      <div className="nav-actions">
        <button onClick={() => setCount((count) => count + 1)}>
        <button 
          count is {count}
          className={`icon-btn ${showFavoritesOnly ? 'active' : ''}`}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          title="Favoriten anzeigen"
        >
          <Heart size={24} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
        </button>
        </button>
        <p>
        <button 
          Edit <code>src/App.jsx</code> and save to test HMR
          className="icon-btn"
        </p>
          onClick={() => setIsSettingsOpen(true)}
          title="Einstellungen"
        >
          <Settings size={24} />
        </button>
      </div>
      </div>
      <p className="read-the-docs">
    </nav>
        Click on the Vite and React logos to learn more
  );
      </p>
}
function MatchCard({ match, isFavorite, toggleFavorite, prediction, onPredictionChange }) {
  return (
    <div className="match-card">
      <div className="card-header">
        <div className="match-info">
          <span className="match-group"><Users size={14}/> Gruppe {match.group}</span>
          <span className="match-date"><Calendar size={14}/> {match.date}</span>
          <span className="match-location"><MapPin size={14}/> {match.location}</span>
        </div>
        <button 
          className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
          onClick={toggleFavorite}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="teams-container">
        <div className="team-row">
          <div className="team-name">{match.team1}</div>
        </div>
        <div className="team-row">
          <div className="team-name">{match.team2}</div>
        </div>
      </div>
      <div className="prediction-section">
        <span className="prediction-label">Ihr Tipp:</span>
        <div className="prediction-inputs">
          <input 
            type="text" 
            className="pred-input" 
            maxLength={2}
            value={prediction[1]}
            onChange={(e) => onPredictionChange(match.id, 1, e.target.value.replace(/\D/g, ''))}
          />
          <span className="pred-separator">:</span>
          <input 
            type="text" 
            className="pred-input" 
            maxLength={2}
            value={prediction[2]}
            onChange={(e) => onPredictionChange(match.id, 2, e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </div>
    </div>
    </div>
  )
  );
}
}
export default App
function SettingsMenu({ isOpen, onClose, theme, setTheme }) {
  const [openSection, setOpenSection] = useState('bg'); // 'bg', 'card', 'nav'
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
  const updateTheme = (key, val) => {
    setTheme(prev => ({ ...prev, [key]: val }));
  };
  return (
    <div className={`settings-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
      if(e.target.classList.contains('settings-overlay')) onClose();
    }}>
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Einstellungen</h2>
          <button className="close-btn" onClick={onClose}><X size={24}/></button>
        </div>
        <div className="settings-content">
          <ColorSection 
            title="Hintergrundfarbe"
            isOpen={openSection === 'bg'}
            onToggle={() => toggleSection('bg')}
            activeColor={theme.bg}
            onSelectColor={(val) => updateTheme('bg', val)}
          />
          
          <ColorSection 
            title="Kästchen Farbe (Karten)"
            isOpen={openSection === 'card'}
            onToggle={() => toggleSection('card')}
            activeColor={theme.card}
            onSelectColor={(val) => updateTheme('card', val)}
          />
          <ColorSection 
            title="Obere Leiste (Navbar)"
            isOpen={openSection === 'nav'}
            onToggle={() => toggleSection('nav')}
            activeColor={theme.nav}
            onSelectColor={(val) => updateTheme('nav', val)}
          />
        </div>
      </div>
    </div>
  );
}
function ColorSection({ title, isOpen, onToggle, activeColor, onSelectColor }) {
  return (
    <div className="setting-group">
      <div className="setting-group-header" onClick={onToggle}>
        <span>{title}</span>
        <ChevronDown size={20} className={`chevron ${isOpen ? 'open' : ''}`} />
      </div>
      <div className={`colors-grid ${isOpen ? 'open' : ''}`}>
        {colors.map(c => {
          const isDeutschland = c.name === "Deutschland Farben";
          const bgStyle = isDeutschland ? { background: "linear-gradient(135deg, #000 33%, #d00 33%, #d00 66%, #fc0 66%)" } : { background: c.value };
          return (
            <button
              key={c.name}
              className={`color-btn ${activeColor === c.value ? 'active' : ''}`}
              style={bgStyle}
              title={c.name}
              onClick={() => onSelectColor(c.value)}
            />
          );
        })}
      </div>
    </div>
  );
}
export default App;
