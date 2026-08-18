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

  const panelTitle = currentPanel?.title || `${currentPanel?.character || 'Leo'}'s Story`;
  const panelQuote = currentPanel?.quote || "How many items do we have?";
  const mascotMsg = currentPanel?.mascotMsg || `Let's help ${currentPanel?.character || 'Leo'} group his items! 🍎`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: '100%',
      width: '100%',
      padding: '0 var(--space-md)',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>

      {/* Progress Bar & Counter Header */}
      <div style={{
        width: '100%',
        maxWidth: '880px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexShrink: 0,
      }}>
        {/* Progress track */}
        <div style={{
          flex: 1,
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${((currentPanelIndex + 1) / STORY_PANELS.length) * 100}%`,
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
            borderRadius: '10px',
            transition: 'width 0.3s ease',
          }} />
        </div>
        {/* Step count */}
        <span style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(15px, 2.2vh, 18px)',
          color: '#ffffff',
          fontWeight: 900,
          flexShrink: 0,
        }}>
          {currentPanelIndex + 1} / {STORY_PANELS.length}
        </span>
      </div>

      {/* Main Glass Card (Split 2-Column) */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '880px',
        backgroundColor: 'rgba(30, 20, 60, 0.55)',
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        padding: 'clamp(16px, 2.5vh, 26px)',
        gap: 'clamp(16px, 2.5vh, 26px)',
        boxSizing: 'border-box',
        boxShadow: '0 14px 44px rgba(0, 0, 0, 0.4)',
        flexShrink: 0,
      }}>
        {/* Left Column — Story Graphic Image */}
        <div style={{
          flex: '0 0 44%',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: 'rgba(12, 4, 36, 0.65)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
          minHeight: 'clamp(200px, 30vh, 260px)',
        }}>
          <img
            src={`/assets/${currentPanel.placeholder}`}
            alt={currentPanel.placeholderLabel || 'Story graphic'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Right Column — Details & Quote */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 'clamp(10px, 1.6vh, 16px)',
        }}>
          {/* Story Title */}
          <h3 style={{
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: 'clamp(22px, 3.8vh, 32px)',
            fontWeight: 900,
            color: '#fbbf24',
            margin: 0,
            lineHeight: 1.2,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}>
            {panelTitle}
          </h3>

          {/* Story Paragraph */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 'clamp(15px, 2.4vh, 19px)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.5,
            margin: 0,
          }}>
            {currentPanel.text}
          </p>

          {/* Highlight Quote Pill */}
          <div style={{
            backgroundColor: 'rgba(20, 14, 45, 0.8)',
            border: '2px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '50px',
            padding: '10px 22px',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)',
          }}>
            <span style={{
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              fontSize: 'clamp(15px, 2.3vh, 18px)',
              fontWeight: 900,
              color: '#fbbf24',
              letterSpacing: '0.02em',
            }}>
              ✨ "{panelQuote}" ✨
            </span>
          </div>

          {/* Mascot Speech Bubble */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '4px',
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
              boxShadow: '0 3px 12px rgba(251, 191, 36, 0.4)',
              border: '2px solid #ffffff',
            }}>
              🦁
            </div>
            <div style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: '16px',
              padding: '8px 18px',
              fontFamily: "'Nunito', sans-serif",
              fontSize: 'clamp(14px, 2vh, 17px)',
              fontWeight: 900,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              position: 'relative',
            }}>
              {mascotMsg}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '880px',
        flexShrink: 0,
      }}>
        {/* Back Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPanelIndex === 0}
          style={{
            padding: '10px 28px',
            borderRadius: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            color: currentPanelIndex === 0 ? 'rgba(255,255,255,0.3)' : '#ffffff',
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: 'clamp(15px, 2.2vh, 18px)',
            fontWeight: 900,
            cursor: currentPanelIndex === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          ← Back
        </button>

        {/* Pagination Dots */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {STORY_PANELS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentPanelIndex ? '12px' : '10px',
                height: i === currentPanelIndex ? '12px' : '10px',
                borderRadius: '50%',
                backgroundColor: i === currentPanelIndex ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)',
                boxShadow: i === currentPanelIndex ? '0 0 12px rgba(251, 191, 36, 0.7)' : 'none',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          style={{
            padding: '10px 32px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            border: 'none',
            color: '#0f172a',
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: 'clamp(16px, 2.4vh, 20px)',
            fontWeight: 900,
            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, boxShadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.5)';
          }}
        >
          {currentPanelIndex === STORY_PANELS.length - 1 ? 'Go to Simulation ➔' : 'Next ➔'}
        </button>
      </div>
    </div>
  );
}
