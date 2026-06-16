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

  const mascotMood =
    currentPanel.style === 'celebration' ? 'celebrating'
    : currentPanel.style === 'thinking'  ? 'thinking'
    : 'idle';

  return (
    <div
      className="glass-card phase-screen phase-screen--wide"
      style={{ padding: 'var(--space-sm) var(--space-md)', gap: 0 }}
    >
      {/* Top accent band */}
      <div className="phase-band phase-band--story" style={{ marginBottom: 'var(--space-xs)' }} />

      {/* Header row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-xs)',
        flexShrink: 0,
      }}>
        <h2 style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(20px, 3.2vh, 34px)',
          fontWeight: 900,
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.1,
        }}>
          <span style={{ color: 'var(--color-story)' }}>{currentPanel.character}</span>'s Biscuit Story
        </h2>

        {/* Panel counter pill */}
        <span style={{
          background: 'rgba(251,146,60,0.18)',
          border: '1.5px solid rgba(251,146,60,0.45)',
          color: 'var(--color-story)',
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(12px,1.6vh,15px)',
          padding: '4px 14px',
          borderRadius: '50px',
          flexShrink: 0,
        }}>
          {currentPanelIndex + 1} / {STORY_PANELS.length}
        </span>
      </div>

      {/* Main content — image left, text+mascot right */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-md)',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}>

        {/* LEFT — story image, fills available height */}
        <div style={{
          flex: '0 0 48%',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '2px solid rgba(251,146,60,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backgroundColor: 'rgba(12,4,36,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
        }}>
          <img
            src={`/assets/${currentPanel.placeholder}`}
            alt={currentPanel.placeholderLabel}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* RIGHT — mascot + quote + buttons */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 0,
          gap: 'var(--space-xs)',
        }}>

          {/* Mascot */}
          <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <Mascot mood={mascotMood} />
          </div>

          {/* Story quote — large bold text */}
          <div style={{
            flex: 1,
            background: 'rgba(251,146,60,0.10)',
            borderLeft: '5px solid var(--color-story)',
            borderRadius: '16px',
            padding: 'var(--space-sm) var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            minHeight: 0,
            overflow: 'hidden',
          }}>
            <p style={{
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              fontSize: 'clamp(15px, 2.2vh, 22px)',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.5,
              overflowY: 'auto',
              maxHeight: '100%',
            }}>
              "{currentPanel.text}"
            </p>
          </div>

          {/* Navigation buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            gap: '10px',
          }}>
            <button
              onClick={handlePrev}
              disabled={currentPanelIndex === 0}
              className="btn-secondary"
              style={{ padding: '10px 24px', fontSize: 'clamp(14px,1.8vh,17px)' }}
            >
              ◀ Back
            </button>

            {/* Dot progress indicators */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {STORY_PANELS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentPanelIndex ? '18px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: i === currentPanelIndex
                      ? 'var(--color-story)'
                      : i < currentPanelIndex
                        ? 'rgba(251,146,60,0.45)'
                        : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="btn-gold"
              style={{ padding: '10px 24px', fontSize: 'clamp(14px,1.8vh,17px)' }}
            >
              {currentPanelIndex === STORY_PANELS.length - 1 ? 'Go to Simulation ➔' : 'Next ➔'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
