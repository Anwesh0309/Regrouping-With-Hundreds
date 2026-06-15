import { useMemo, useState } from 'react';
import { usePageNarration } from '../../hooks/useAudio';
import { STORY_PANELS } from '../../data/storyContent';
import { storyPanelNarration } from '../../utils/narration';
import { cleanupAudio } from '../../utils/audioManager';
import Mascot from '../shared/Mascot';

export default function StoryPhase({ audioEnabled, onComplete }) {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const currentPanel = STORY_PANELS[currentPanelIndex];
  const segments = useMemo(
    () => (currentPanel ? storyPanelNarration(currentPanel.id) : []),
    [currentPanel]
  );

  usePageNarration(audioEnabled, `story-panel-${currentPanelIndex}`, segments);

  const handleNext = () => {
    cleanupAudio();
    setTimeout(() => {
      if (currentPanelIndex < STORY_PANELS.length - 1) {
        setCurrentPanelIndex(currentPanelIndex + 1);
      } else {
        onComplete();
      }
    }, 50);
  };

  const handlePrev = () => {
    cleanupAudio();
    setTimeout(() => {
      if (currentPanelIndex > 0) {
        setCurrentPanelIndex(currentPanelIndex - 1);
      }
    }, 50);
  };

  return (
    <div className="glass-card glass-card--interactive phase-screen phase-screen--narrow" style={{ padding: 'var(--space-md)' }}>
      <div className="phase-band phase-band--story" style={{ marginBottom: 'var(--space-xs)' }} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-xs)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <h2 className="text-section-heading" style={{ fontSize: 'clamp(20px, 3vh, 32px)' }}>
          {currentPanel.character}'s Biscuit Story
        </h2>
        <span className="badge-pill" style={{ fontSize: 'clamp(11px, 1.5vh, 14px)', padding: '6px 14px' }}>
          Panel {currentPanelIndex + 1} of {STORY_PANELS.length}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xs)' }}>
        <Mascot
          mood={
            currentPanel.style === 'celebration'
              ? 'celebrating'
              : currentPanel.style === 'thinking'
                ? 'thinking'
                : 'idle'
          }
        />
      </div>

      <div style={{
        marginBottom: 'var(--space-sm)',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        backgroundColor: 'rgba(12, 4, 36, 0.6)',
        height: 'clamp(130px, 25vh, 230px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={`/assets/${currentPanel.placeholder}`}
          alt={currentPanel.placeholderLabel}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
        />
      </div>

      <div className="story-quote" style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-sm)' }}>
        <p className="text-body" style={{ color: '#ffffff', margin: 0, fontSize: 'var(--fs-body-text)', lineHeight: 1.4 }}>
          "{currentPanel.text}"
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handlePrev}
          disabled={currentPanelIndex === 0}
          className="btn-secondary"
          style={{ padding: '8px 24px', fontSize: '15px' }}
        >
          ◀ Back
        </button>

        <button onClick={handleNext} className="btn-gold" style={{ padding: '10px 28px', fontSize: 'var(--fs-button-text)' }}>
          {currentPanelIndex === STORY_PANELS.length - 1 ? 'Go to Simulation ➔' : 'Next Panel ➔'}
        </button>
      </div>
    </div>
  );
}
