({ onInput, onDelete, onClear }) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', '⌫'];

  const handlePress = (key) => {
    if (key === '⌫') {
      if (onDelete) onDelete();
    } else if (key === 'Clear') {
      if (onClear) onClear();
    } else {
      if (onInput) onInput(key);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      maxWidth: '280px',
      margin: '0 auto',
      width: '100%'
    }}>
      {digits.map((digit) => {
        const isAction = digit === 'Clear' || digit === '⌫';
        const isDelete = digit === '⌫';
        
        return (
          <button
            key={digit}
            type="button"
            onClick={() => handlePress(digit)}
            style={{
              padding: '16px 0',
              fontSize: isAction ? '16px' : '24px',
              fontWeight: '700',
              borderRadius: '12px',
              border: isAction 
                ? (isDelete ? '1.5px solid rgba(239, 68, 68, 0.25)' : '1.5px solid rgba(99, 102, 241, 0.25)') 
                : '1.5px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: isAction 
                ? (isDelete ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)') 
                : 'rgba(255, 255, 255, 0.03)',
              color: isAction 
                ? (isDelete ? '#f87171' : '#a5b4fc') 
                : '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (!isAction) {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              } else {
                e.currentTarget.style.backgroundColor = isDelete ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAction) {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              } else {
                e.currentTarget.style.backgroundColor = isDelete ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)';
              }
              e.currentTarget.style.transform = 'none';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(1.5px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'none';
            }}
          >
            {digit}
          </button>
        );
      })}
    </div>
  );
}
