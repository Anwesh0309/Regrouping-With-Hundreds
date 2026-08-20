import React from 'react';

export default function ProgressMap({ currentPhase, phaseComplete, onSelectPhase, audioEnabled, onToggleAudio }) {
  const phases = [
    { id: 'wonder',   label: 'Wonder',   icon: '🧙', num: '01' },
    { id: 'story',    label: 'Story',    icon: '📖', num: '02' },
    { id: 'simulate', label: 'Simulate', icon: '✏️', num: '03' },
    { id: 'play',     label: 'Practice', icon: '🎮', num: '04' },
    { id: 'reflect',  label: 'Reflect',  icon: '📜', num: '05' },
  ];

  const currentIndex = phases.findIndex((p) => p.id === currentPhase);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 14px',
      borderRadius: '50px',
      backgroundColor: 'rgba(18, 12, 45, 0.75)',
      border: '1.5px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      {phases.map((phase, index) => {
        const isActive    = phase.id === currentPhase;
        const isCompleted = phaseComplete ? phaseComplete[phase.id] : false;
        const isLast      = index === phases.length - 1;

        return (
          <React.Fragment key={phase.id}>
            <button
              type="button"
              onClick={() => onSelectPhase && onSelectPhase(phase.id)}
              title={`Go to ${phase.label} phase`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '50px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                outline: 'none',
              }}
            >
              {/* Number circle */}
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: isCompleted
                  ? '#22c55e'
                  : isActive
                    ? '#facc15'
                    : 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 900,
                fontFamily: "'Fredoka One', Nunito, sans-serif",
                color: isCompleted ? '#ffffff' : isActive ? '#0c0424' : 'rgba(255, 255, 255, 0.7)',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}>
                {isCompleted ? '✓' : phase.num}
              </div>

              {/* Icon + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '13px' }}>{phase.icon}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  fontFamily: "'Fredoka One', Nunito, sans-serif",
                  color: isActive ? '#facc15' : isCompleted ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                  whiteSpace: 'nowrap',
                }}>
                  {phase.label}{!isLast ? ' —' : ''}
                </span>
              </div>
            </button>
          </React.Fragment>
        );
      })}

      {/* Mute button beside nav bar */}
      {onToggleAudio && (
        <button
          type="button"
          onClick={onToggleAudio}
          title={audioEnabled ? 'Disable Voice Narration' : 'Enable Voice Narration'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            outline: 'none',
            marginLeft: '4px',
          }}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      )}
    </div>
  );
}

