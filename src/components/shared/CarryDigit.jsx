({ column, visible }) {
  if (!visible) return null;
  return (
    <span 
      className={`carry-digit carry-digit--${column}`}
      aria-label="Carry 1" 
      role="img"
      style={{
        display: 'inline-block',
        fontSize: '18px',
        fontWeight: '700',
        color: '#43A047',
        animation: 'carryFloat 0.35s ease-out forwards',
        position: 'absolute',
        top: '-24px',
        left: column === 'h' ? '24px' : column === 't' ? '88px' : '0px',
        zIndex: 5
      }}
    >
      1
    </span>
  );
}
