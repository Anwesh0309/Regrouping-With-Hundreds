import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
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

// Bump version to wipe any stale saved progress that skips phases
const SESSION_KEY = 'intellia_regroup_hundreds_v3';

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

// Wipe ALL old session keys so stale phase flags can't bleed through
['intellia_regroup_hundreds_v1', 'intellia_regroup_hundreds_v2'].forEach((k) => {
  try { window.localStorage.removeItem(k); } catch { /* ignore */ }
});

// ── Strict phase order — NEVER skip any phase ───────────────────────────────
// The sequence is always: intro → wonder → story → simulate → play → reflect → complete
// Resume logic: find the FIRST incomplete phase and start there.
// Story is NOT allowed to be skipped even on resume.
const PHASE_ORDER = ['wonder', 'story', 'simulate', 'play', 'reflect'];

function getResumePhase(phaseComplete) {
  const pc = phaseComplete ?? {};
  // Walk the sequence — return the first phase that is NOT yet complete
  for (const phase of PHASE_ORDER) {
    if (!pc[phase]) return phase;
  }
  return 'complete';
}

// ────────────────────────────────────────────────────────────────────────────

function App() {
  const [phase, setPhase] = useState('intro');
  const [gameState, setGameState] = useLocalStorage(SESSION_KEY, INITIAL_STATE);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const changePhase = (nextPhase) => {
    cleanupAudio();
    setPhase(nextPhase);
  };

  // "Begin / Resume" — always follows the strict linear order
  const handleStart = () => {
    const next = getResumePhase(gameState.phaseComplete);
    changePhase(next);
  };

  const handleReset = () => {
    if (window.confirm('Reset all lesson progress? This will clear your stars, badges, and XP.')) {
      setGameState(INITIAL_STATE);
      changePhase('intro');
    }
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

  const showHeader      = phase !== 'intro' && phase !== 'complete';
  const showResetFooter = phase !== 'intro' && phase !== 'complete' && phase !== 'reflect';

  return (
    <div className="app-container">
      {/* Floating background numbers */}
      <div className="floating-bg-container">
        <span className="floating-bg-item" style={{ top: '12%', left:  '8%', fontSize: '52px', animationDelay:   '0s' }}>100</span>
        <span className="floating-bg-item" style={{ top: '22%', left: '82%', fontSize: '56px', animationDelay:  '-4s' }}>347</span>
        <span className="floating-bg-item" style={{ top: '65%', left: '12%', fontSize: '44px', animationDelay:  '-8s' }}>200</span>
        <span className="floating-bg-item" style={{ top: '75%', left: '85%', fontSize: '64px', animationDelay:  '-2s' }}>999</span>
        <span className="floating-bg-item" style={{ top: '40%', left:  '5%', fontSize: '38px', animationDelay: '-12s' }}>H</span>
        <span className="floating-bg-item" style={{ top: '18%', left: '30%', fontSize: '36px', animationDelay:  '-6s' }}>T</span>
        <span className="floating-bg-item" style={{ top: '80%', left: '48%', fontSize: '42px', animationDelay: '-10s' }}>O</span>
        <span className="floating-bg-item" style={{ top: '50%', left: '90%', fontSize: '34px', animationDelay: '-14s' }}>123</span>
        <span className="floating-bg-item" style={{ top:  '8%', left: '72%', fontSize: '46px', animationDelay: '-16s' }}>500</span>
        <span className="floating-bg-item" style={{ top: '55%', left: '42%', fontSize: '40px', animationDelay:  '-9s' }}>639</span>
      </div>

      {/* Header */}
      <header className="glass-header">
        <button type="button" onClick={() => changePhase('intro')} className="btn-icon-glass">
          <span style={{ fontSize: '18px' }}>🏠</span>
          <span>Home</span>
        </button>

        {showHeader && (
          <div style={{ flex: 1, margin: '0 16px' }}>
            <ProgressMap currentPhase={phase} phaseComplete={gameState.phaseComplete} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="btn-icon-glass"
            title={audioEnabled ? 'Disable Narration' : 'Enable Narration'}
          >
            <span>{audioEnabled ? '🔊' : '🔇'}</span>
            <span>Voice</span>
          </button>

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

      {/* Main content */}
      <main className="app-main">
        {phase === 'intro' && (
          <IntroScreen
            onStart={handleStart}
            hasSavedSession={gameState.xp > 0}
            onResetSession={handleReset}
          />
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
