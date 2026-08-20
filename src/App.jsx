import { useState, useEffect } from 'react';
import ProgressMap from './components/ProgressMap';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';
import CompleteScreen from './components/CompleteScreen';
import { cleanupAudio } from './utils/audioManager';
import './App.css';

const INITIAL_STATE = {
  xp: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  phaseComplete: {
    wonder:   false,
    story:    false,
    simulate: false,
    play:     false,
    reflect:  false,
  },
  simStationsComplete: [false, false, false],
  worldScores: Array(10).fill(null),
  worldStars:  Array(10).fill(null),
  doubleReGroupFirstTry: false,
};

function App() {
  const [phase, setPhase] = useState('intro');
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Always reset progress and wipe saved sessions whenever user enters the module
  useEffect(() => {
    try {
      window.localStorage.clear();
    } catch { /* ignore */ }
    setGameState(INITIAL_STATE);
  }, []);

  const changePhase = (nextPhase) => {
    cleanupAudio();
    // If returning to intro, reset all progress fresh for the next run
    if (nextPhase === 'intro') {
      try { window.localStorage.clear(); } catch { /* ignore */ }
      setGameState(INITIAL_STATE);
    }
    setPhase(nextPhase);
  };

  // Reset session state and return to intro
  const handleReset = () => {
    try { window.localStorage.clear(); } catch { /* ignore */ }
    setGameState(INITIAL_STATE);
    changePhase('intro');
  };

  // Always start fresh from wonder phase with zero progress
  const handleStart = () => {
    try { window.localStorage.clear(); } catch { /* ignore */ }
    setGameState(INITIAL_STATE);
    changePhase('wonder');
  };

  // ── Phase completion handlers (strict sequence) ──────────────────────────

  const handleCompleteWonder = () => {
    setGameState((prev) => ({
      ...prev,
      phaseComplete: { ...prev.phaseComplete, wonder: true },
    }));
    cleanupAudio();
    setPhase('story');          // ALWAYS goes to story next
  };

  const handleCompleteStory = () => {
    setGameState((prev) => ({
      ...prev,
      phaseComplete: { ...prev.phaseComplete, story: true },
    }));
    cleanupAudio();
    setPhase('simulate');
  };

  const handleCompleteSimulateStation = (stationIdx) => {
    setGameState((prev) => {
      const nextStations = [...prev.simStationsComplete];
      nextStations[stationIdx] = true;
      return { ...prev, simStationsComplete: nextStations };
    });
  };

  const handleCompleteSimulatePhase = () => {
    setGameState((prev) => ({
      ...prev,
      phaseComplete: { ...prev.phaseComplete, simulate: true },
    }));
    changePhase('play');
  };

  const handleCompletePlayPhase = () => {
    setGameState((prev) => ({
      ...prev,
      phaseComplete: { ...prev.phaseComplete, play: true },
    }));
    changePhase('reflect');
  };

  const handleCompleteReflectPhase = () => {
    setGameState((prev) => ({
      ...prev,
      phaseComplete: { ...prev.phaseComplete, reflect: true },
    }));
    changePhase('complete');
  };

  const showHeader      = phase !== 'intro';
  const showResetFooter = phase !== 'intro' && phase !== 'complete' && phase !== 'reflect';

  return (
    <div className="app-container">
      {/* Floating background numbers */}
      <div className="floating-bg-container">
        <span className="floating-bg-item" style={{ top: '4%', left:  '2%', fontSize: '76px', opacity: 0.1, animationDelay:   '0s' }}>50</span>
        <span className="floating-bg-item" style={{ top: '5%', left: '15%', fontSize: '88px', opacity: 0.1, animationDelay:  '-4s' }}>3</span>
        <span className="floating-bg-item" style={{ top: '4%', right: '14%', fontSize: '64px', opacity: 0.1, animationDelay:  '-8s' }}>1015</span>
        <span className="floating-bg-item" style={{ top: '5%', right: '5%', fontSize: '88px', opacity: 0.1, animationDelay:  '-2s' }}>5</span>
        <span className="floating-bg-item" style={{ top: '65%', left: '12%', fontSize: '44px', opacity: 0.05, animationDelay:  '-8s' }}>200</span>
        <span className="floating-bg-item" style={{ top: '75%', left: '85%', fontSize: '64px', opacity: 0.05, animationDelay:  '-2s' }}>999</span>
      </div>

      {/* Header — hidden completely on intro phase */}
      {showHeader && (
        <header className="glass-header" style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 120px',
          alignItems: 'center',
          padding: '8px 20px',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {/* Left: Home Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button type="button" onClick={() => changePhase('intro')} className="btn-icon-glass">
              <span style={{ fontSize: '18px' }}>🏠</span>
              <span>Home</span>
            </button>
          </div>

          {/* Center: ProgressMap with Mute Button directly beside nav bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressMap
              currentPhase={phase}
              phaseComplete={gameState.phaseComplete}
              onSelectPhase={changePhase}
              audioEnabled={audioEnabled}
              onToggleAudio={() => setAudioEnabled(!audioEnabled)}
            />
          </div>

          {/* Right: Close Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => { if (window.confirm('Close lesson and return to home?')) changePhase('intro'); }}
              className="btn-close"
              title="Close Lesson"
            >
              ✕
            </button>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="app-main">
        {phase === 'intro' && (
          <IntroScreen onStart={handleStart} />
        )}

        {phase === 'wonder' && (
          <WonderPhase audioEnabled={audioEnabled} onComplete={handleCompleteWonder} />
        )}

        {phase === 'story' && (
          <StoryPhase audioEnabled={audioEnabled} onComplete={handleCompleteStory} />
        )}

        {phase === 'simulate' && (
          <SimulatePhase
            audioEnabled={audioEnabled}
            simStationsComplete={gameState.simStationsComplete}
            onCompleteStation={handleCompleteSimulateStation}
            onCompletePhase={handleCompleteSimulatePhase}
          />
        )}

        {phase === 'play' && (
          <PlayPhase
            audioEnabled={audioEnabled}
            gameState={gameState}
            setGameState={setGameState}
            onCompletePhase={handleCompletePlayPhase}
          />
        )}

        {phase === 'reflect' && (
          <ReflectPhase
            audioEnabled={audioEnabled}
            onComplete={handleCompleteReflectPhase}
            gameState={gameState}
          />
        )}

        {phase === 'complete' && (
          <CompleteScreen gameState={gameState} onResetSession={handleReset} />
        )}
      </main>

      {/* Reset footer */}
      {showResetFooter && (
        <footer style={{ padding: '12px 24px', display: 'flex', justifyContent: 'center', position: 'sticky', bottom: 0, zIndex: 40 }}>
          <button type="button" onClick={handleReset} className="btn-reset-footer">
            Reset Lesson Progress
          </button>
        </footer>
      )}
    </div>
  );
}

export default App;
