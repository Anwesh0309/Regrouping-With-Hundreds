import React, { Fragment } from 'react';

export default function Base10Block({ type, size = 50, crossedOut = false, onClick = null }) {
  const opacityVal = crossedOut ? 0.3 : 1;

  const renderSVG = () => {
    switch (type) {
      case 'hundreds':
        // 10x10 blue grid flat
        return (
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            style={{ display: 'block', opacity: opacityVal, cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
          >
            {/* Base block */}
            <rect x="2" y="2" width="96" height="96" rx="6" fill="#1E88E5" stroke="#1565C0" strokeWidth="2" />
            {/* Grid lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={(i + 1) * 10} y1="2" x2={(i + 1) * 10} y2="98" stroke="#1565C0" strokeWidth="1" />
                <line x1="2" y1={(i + 1) * 10} x2="98" y2={(i + 1) * 10} stroke="#1565C0" strokeWidth="1" />
              </React.Fragment>
            ))}
            {crossedOut && (
              <path d="M 0 0 L 100 100 M 100 0 L 0 100" stroke="#E53935" strokeWidth="6" strokeLinecap="round" />
            )}
          </svg>
        );
      case 'tens':
        // 1x10 orange vertical rod
        return (
          <svg 
            width={size * 0.25} 
            height={size} 
            viewBox="0 0 20 100" 
            style={{ display: 'block', opacity: opacityVal, cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
          >
            <rect x="2" y="2" width="16" height="96" rx="4" fill="#FB8C00" stroke="#E65100" strokeWidth="2" />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1="2" y1={(i + 1) * 10} x2="18" y2={(i + 1) * 10} stroke="#E65100" strokeWidth="1.5" />
            ))}
            {crossedOut && (
              <path d="M 0 0 L 20 100 M 20 0 L 0 100" stroke="#E53935" strokeWidth="4" strokeLinecap="round" />
            )}
          </svg>
        );
      case 'ones':
      default:
        // 1x1 green cube
        return (
          <svg 
            width={size * 0.25} 
            height={size * 0.25} 
            viewBox="0 0 25 25" 
            style={{ display: 'block', opacity: opacityVal, cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
          >
            <rect x="1" y="1" width="23" height="23" rx="3" fill="#43A047" stroke="#1B5E20" strokeWidth="2" />
            {crossedOut && (
              <path d="M 0 0 L 25 25 M 25 0 L 0 25" stroke="#E53935" strokeWidth="3" strokeLinecap="round" />
            )}
          </svg>
        );
    }
  };

  return (
    <div 
      className={`base10-block base10-block--${type}`}
      style={{
        display: 'inline-block',
        padding: '2px',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        transform: crossedOut ? 'scale(0.95)' : 'scale(1)'
      }}
    >
      {renderSVG()}
    </div>
  );
}
