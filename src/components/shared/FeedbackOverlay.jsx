import React from 'react';

/**
 * Centered popup card feedback — scaled up for Grade 2 readability.
 * Both correct & incorrect show a single "Next →" button that advances
 * to the next question (no retry — this is test mode).
 */
export default function FeedbackOverlay({
  visible,
  isCorrect,
  message,
  explanation,
  onContinue,
}) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.18s ease-out',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: isCorrect ? '#16a34a' : '#dc2626',
          borderRadius: '28px',
          padding: 'clamp(24px, 3.5vh, 36px) clamp(24px, 3.5vw, 36px)',
          width: '100%',
          maxWidth: '440px',
          textAlign: 'center',
          boxShadow: isCorrect
            ? '0 24px 64px rgba(22,163,74,0.5)'
            : '0 24px 64px rgba(220,38,38,0.5)',
          animation: 'popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          boxSizing: 'border-box',
          border: '3px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: '64px', lineHeight: 1 }}>
          {isCorrect ? '🎉' : '😢'}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(28px, 4vh, 36px)',
          fontWeight: 900,
          color: '#ffffff',
          margin: 0,
          textShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          {isCorrect ? 'Correct! 🎉' : 'Not quite!'}
        </h2>

        {/* Message */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 'clamp(16px, 2.4vh, 20px)',
          fontWeight: 900,
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.45,
        }}>
          {message}
        </p>

        {/* Explanation (only for wrong answers) */}
        {!isCorrect && explanation && (
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 'clamp(14px, 2vh, 17px)',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.95)',
            margin: 0,
            lineHeight: 1.45,
            borderTop: '2px solid rgba(255,255,255,0.25)',
            paddingTop: '12px',
            width: '100%',
          }}>
            {explanation}
          </p>
        )}

        {/* Single advance button — always moves to next question */}
        <button
          type="button"
          onClick={onContinue}
          style={{
            marginTop: '6px',
            backgroundColor: 'rgba(255,255,255,0.25)',
            border: '2.5px solid #ffffff',
            color: '#ffffff',
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(18px, 2.6vh, 22px)',
            padding: '12px 36px',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, backgroundColor 0.18s ease',
            width: '100%',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          Next ➔
        </button>
      </div>
    </div>
  );
}
