import React from 'react';

export default function ProgressMap({ currentPhase, phaseComplete }) {
  const phases = [
    { id: 'wonder',   label: 'Wonder',   icon: '🔮', num: '01' },
    { id: 'story',    label: 'Story',    icon: '📖', num: '02' },
    { id: 'simulate', label: 'Simulate', icon: '🧪', num: '03' },
    { id: 'play',     label: 'Play',     icon: '🎮', num: '04' },
    { id: 'reflect',  label: 'Reflect',  icon: '📝', num: '05' },
  ];

  const currentIndex = phases.findIndex((p) => p.id === currentPhase);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
      width: '100%',
      maxWidth: '580px',
      margin: '0 auto',
    }}>
      {phases.map((phase, index) => {
        const isActive    = phase.id === currentPhase;
        const isCompleted = phaseComplete[phase.id];
        const isPast      = index < currentIndex;

        return (
          <React.Fragment key={phase.id}>
            {/* Phase pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px 5px 5px',
              borderRadius: '50px',
              backgroundColor: isActive
                ? 'rgba(255,255,255,0.12)'
                : isCompleted
                  ? 'rgba(74,222,128,0.12)'
                  : 'transparent',
              border: isActive
                ? '1.5px solid rgba(255,255,255,0.25)'
                : isCompleted
                  ? '1.5px solid rgba(74,222,128,0.3)'
                  : '1.5px solid transparent',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}>
              {/* Number circle */}
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: isCompleted
                  ? '#4ade80'
                  : isActive
                    ? '#facc15'
                    : 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 900,
                fontFamily: "'Fredoka One', Nunito, sans-serif",
                color: isCompleted || isActive ? '#0c0424' : '#94a3b8',
                flexShrink: 0,
                transition: 'all 0.3s ease',
              }}>
                {isCompleted ? '✓' : phase.num}
              </div>

              {/* Icon + label — only shown when active or completed */}
              {(isActive || isCompleted) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '13px' }}>{phase.icon}</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 900,
                    fontFamily: "'Fredoka One', Nunito, sans-serif",
                    color: isActive ? '#ffffff' : '#4ade80',
                    whiteSpace: 'nowrap',
                  }}>
                    {phase.label}
                  </span>
                </div>
              )}

              {/* Compact icon for inactive phases */}
              {!isActive && !isCompleted && (
                <span style={{ fontSize: '12px', opacity: 0.45 }}>{phase.icon}</span>
              )}
            </div>

            {/* Connector */}
            {index < phases.length - 1 && (
              <div style={{
                flex: '1 1 16px',
                minWidth: '8px',
                maxWidth: '28px',
                height: '2px',
                borderTop: `2px ${(isPast || isCompleted) ? 'solid' : 'dashed'} ${(isPast || isCompleted) ? 'rgba(74,222,128,0.6)' : 'rgba(255,255,255,0.18)'}`,
                margin: '0 2px',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
