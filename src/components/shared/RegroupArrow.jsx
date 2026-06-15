({ from, to, type }) {
  // from/to: 'o' | 't' | 'h' -> pixel X position of column center in 192px layout
  const COLUMN_X = { o: 160, t: 96, h: 32 }; 

  const x1 = COLUMN_X[from];
  const x2 = COLUMN_X[to];
  const cy = -20; // Arc apex above the column headers
  
  // Create arc path
  const d = `M ${x1} 15 Q ${(x1 + x2) / 2} ${cy} ${x2} 15`;

  const color = type === 'carry' ? '#FFD700' : '#E53935';

  return (
    <svg 
      className={`regroup-arrow ${type}`}
      viewBox="0 0 192 40" 
      height="40" 
      width="192"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '-15px',
        left: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'visible'
      }}
    >
      <defs>
        <marker 
          id={`arrowhead-${type}`} 
          markerWidth="10" 
          markerHeight="7"
          refX="9" 
          refY="3.5" 
          orient="auto"
        >
          <polygon 
            points="0 0, 10 3.5, 0 7"
            fill={color} 
          />
        </marker>
      </defs>
      <path 
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeDasharray={type === 'borrow' ? '6 3' : '0'}
        markerEnd={`url(#arrowhead-${type})`}
        style={{
          strokeDasharray: type === 'borrow' ? '6 3' : '200',
          strokeDashoffset: type === 'borrow' ? '0' : '200',
          animation: type === 'carry' ? 'drawArc 0.4s ease-out forwards' : 'none',
          opacity: 1
        }} 
      />
    </svg>
  );
}
