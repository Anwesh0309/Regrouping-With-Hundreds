import React from 'react';

export default function Mascot({ mood = 'idle', className = '' }) {
  // SVG face details depending on mood
  const renderFace = () => {
    switch (mood) {
      case 'happy':
        return (
          <>
            {/* Arched happy eyes */}
            <path d="M 22 25 Q 30 15 38 25" stroke="#00E676" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 62 25 Q 70 15 78 25" stroke="#00E676" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Happy open mouth */}
            <path d="M 40 45 Q 50 55 60 45 Z" fill="#00E676" />
          </>
        );
      case 'celebrating':
        return (
          <>
            {/* Star-shaped sparkling eyes */}
            <path d="M 30 14 L 33 22 L 41 22 L 35 27 L 37 35 L 30 30 L 23 35 L 25 27 L 19 22 L 27 22 Z" fill="#FFD700" />
            <path d="M 70 14 L 73 22 L 81 22 L 75 27 L 77 35 L 70 30 L 63 35 L 65 27 L 59 22 L 67 22 Z" fill="#FFD700" />
            {/* Waving mouth */}
            <path d="M 42 45 Q 50 48 58 45" stroke="#FFD700" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Squinted thinking eyes */}
            <ellipse cx="30" cy="22" rx="8" ry="2" fill="#29B6F6" />
            <ellipse cx="70" cy="22" rx="8" ry="6" fill="#29B6F6" />
            {/* S-curve mouth */}
            <path d="M 43 45 Q 50 40 57 45" stroke="#29B6F6" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case 'curious':
        return (
          <>
            {/* Wide curious eyes (one bigger than the other) */}
            <circle cx="30" cy="22" r="9" fill="#FFCA28" />
            <circle cx="70" cy="22" r="6" fill="#FFCA28" />
            {/* O-shaped mouth */}
            <circle cx="50" cy="45" r="4" fill="#FFCA28" />
          </>
        );
      case 'idle':
      default:
        return (
          <>
            {/* Normal round eyes */}
            <circle cx="30" cy="22" r="7" fill="#5C6BC0" />
            <circle cx="70" cy="22" r="7" fill="#5C6BC0" />
            {/* Gentle smile */}
            <path d="M 42 42 Q 50 48 58 42" stroke="#5C6BC0" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <div className={`mascot-container ${mood} ${className}`} style={{ width: 'var(--mascot-size, 100px)', height: 'var(--mascot-size, 100px)', display: 'inline-block' }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="facePlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Antennas */}
        <line x1="50" y1="20" x2="50" y2="5" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="5" r="5" fill={mood === 'celebrating' ? '#ffd700' : mood === 'happy' ? '#22c55e' : '#f97316'} className="antenna-glow" filter="url(#neonGlow)" />

        {/* Ears / Sidebolts */}
        <rect x="5" y="42" width="6" height="12" rx="2" fill="#475569" />
        <rect x="89" y="42" width="6" height="12" rx="2" fill="#475569" />

        {/* Main Head / Body (Single metallic capsule shape) */}
        <rect x="10" y="20" width="80" height="60" rx="25" fill="url(#robotBodyGrad)" stroke="#94a3b8" strokeWidth="3" />
        
        {/* Face Screen Plate */}
        <rect x="16" y="26" width="68" height="42" rx="15" fill="url(#facePlateGrad)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Eyes & Mouth */}
        <g filter="url(#neonGlow)">{renderFace()}</g>

        {/* Cheeks */}
        {(mood === 'happy' || mood === 'celebrating') ? (
          <>
            <circle cx="24" cy="36" r="3.5" fill="#f87171" opacity="0.7" />
            <circle cx="76" cy="36" r="3.5" fill="#f87171" opacity="0.7" />
          </>
        ) : null}

        {/* Bottom Roller / Stand */}
        <ellipse cx="50" cy="84" rx="20" ry="6" fill="#475569" />
        <rect x="45" y="76" width="10" height="10" fill="#334155" />
      </svg>
    </div>
  );
}
