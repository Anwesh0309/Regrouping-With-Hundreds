import React from 'react';

/**
 * Centered popup card feedback — test mode style.
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.18s ease-out',
      }}
    >
      <div
        style={{
          backgroundColor: isCorrect ? '#16a34a' : '#dc2626',
          borderRadius: '24px',
          padding: '32px 28px 26px',
          width: 'clamp(220px, 36vw, 300px)',
          textAlign: 'center',
          boxShadow: isCorrect
            ? '0 20px 56px rgba(22,163,74,0.4)'
            : '0 20px 56px rgba(220,38,38,0.4)',
          animation: 'popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: '52px', lineHeight: 1 }}>
          {isCorrect ? '🎉' : '😢'}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(22px,3vh,28px)',
          fontWeight: 900,
          color: '#fff',
          margin: 0,
        }}>
          {isCorrect ? 'Correct! 🎉' : 'Not quite!'}
        </h2>

        {/* Message */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '14px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.92)',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {message}
        </p>

        {/* Explanation (only for wrong answers) */}
        {!isCorrect && explanation && (
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.78)',
            margin: 0,
            lineHeight: 1.4,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '8px',
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
            marginTop: '4px',
            backgroundColor: 'rgba(255,255,255,0.22)',
            border: '2px solid rgba(255,255,255,0.5)',
            color: '#fff',
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontWeight: 900,
            fontSize: '16px',
            padding: '9px 32px',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'background 0.18s',
            width: '100%',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.32)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'}
        >
          Next ➔
        </button>
      </div>
    </div>
  );
}
