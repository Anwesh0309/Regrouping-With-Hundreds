import React from 'react';

export default function ProgressMap({ currentPhase, phaseComplete, onSelectPhase, audioEnabled, onToggleAudio }) {
  const phases = [
    { id: 'wonder',   label: 'Wonder',   icon: '🔮', num: '01' },
    { id: 'story',    label: 'Story',    icon: '📖', num: '02' },
    { id: 'simulate', label: 'Simulate', icon: '🧪', num: '03' },
    { id: 'play',     label: 'Practice', icon: '🎮', num: '04' },
    { id: 'reflect',  label: 'Reflect',  icon: '📝', num: '05' },
  ];

  const currentIndex = phases.findIndex((p) => p.id === currentPhase);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      margin: '0 auto',
    }}>
      {phases.map((phase, index) => {
        const isActive    = phase.id === currentPhase;
        const isCompleted = phaseComplete ? phaseComplete[phase.id] : false;
        const isPast      = index < currentIndex;

        return (
          <React.Fragment key={phase.id}>
            {/* Phase button — unlocked & clickable for all phases */}
            <button
              type="button"
              onClick={() => onSelectPhase && onSelectPhase(phase.id)}
              title={`Go to ${phase.label} phase`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px 6px 6px',
                borderRadius: '50px',
                backgroundColor: isActive
                  ? 'rgba(255,255,255,0.22)'
                  : isCompleted
                    ? 'rgba(74,222,128,0.18)'
                    : 'rgba(255,255,255,0.08)',
                border: isActive
                  ? '2px solid #ffffff'
                  : isCompleted
                    ? '1.5px solid rgba(74,222,128,0.5)'
                    : '1.5px solid rgba(255,255,255,0.25)',
                boxShadow: isActive ? '0 0 14px rgba(255,255,255,0.35)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                outline: 'none',
              }}
            >
              {/* Number circle */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isCompleted
                  ? '#4ade80'
                  : isActive
                    ? '#facc15'
                    : 'rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 900,
                fontFamily: "'Fredoka One', Nunito, sans-serif",
                color: isCompleted || isActive ? '#0c0424' : '#ffffff',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}>
                {isCompleted ? '✓' : phase.num}
              </div>

              {/* Icon + label — displayed for ALL phases */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '13px' }}>{phase.icon}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  fontFamily: "'Fredoka One', Nunito, sans-serif",
                  color: isActive ? '#ffffff' : isCompleted ? '#4ade80' : '#e2e8f0',
                  whiteSpace: 'nowrap',
                }}>
                  {phase.label}
                </span>
              </div>
            </button>

            {/* Connector */}
            {index < phases.length - 1 && (
              <div style={{
                width: '10px',
                height: '2px',
                backgroundColor: isPast || isCompleted ? 'rgba(74,222,128,0.7)' : 'rgba(255,255,255,0.3)',
                margin: '0 1px',
                flexShrink: 0,
              }} />
            )}
          </React.Fragment>
        );
      })}

      {/* Mute button beside nav bar */}
      {onToggleAudio && (
        <>
          <div style={{
            width: '1px',
            height: '20px',
            backgroundColor: 'rgba(255,255,255,0.25)',
            margin: '0 6px',
            flexShrink: 0,
          }} />

          <button
            type="button"
            onClick={onToggleAudio}
            title={audioEnabled ? 'Disable Voice Narration' : 'Enable Voice Narration'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '50px',
              backgroundColor: audioEnabled ? 'rgba(59,130,246,0.25)' : 'rgba(239,68,68,0.25)',
              border: audioEnabled ? '1.5px solid rgba(96,165,250,0.6)' : '1.5px solid rgba(248,113,113,0.6)',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: '13px',
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              transition: 'all 0.2s ease',
              flexShrink: 0,
              outline: 'none',
              boxShadow: audioEnabled ? '0 0 10px rgba(59,130,246,0.3)' : 'none',
            }}
          >
            <span style={{ fontSize: '15px' }}>{audioEnabled ? '🔊' : '🔇'}</span>
            <span>{audioEnabled ? 'Voice' : 'Muted'}</span>
          </button>
        </>
      )}
    </div>
  );
}
