import React from 'react';

export default function ColumnLayout({
  operandA,
  operandB,
  mode = 'add',
  showAnswer = false,
  answer = null,
  userDigits = { h: '', t: '', o: '' },
  onDigitInput = null,
  missingDigits = { h: true, t: true, o: true },
  carryDigits = { h: 0, t: 0 },
  borrowedFrom = { h: false, t: false },
  borrowedTo = { t: false, o: false },
  highlightCol = null,
}) {
  const extractDigits = (n) => {
    if (n === null || n === undefined) return { h: '', t: '', o: '' };
    const num = Math.abs(Math.floor(n));
    return {
      h: Math.floor(num / 100).toString(),
      t: Math.floor((num % 100) / 10).toString(),
      o: (num % 10).toString(),
    };
  };

  const aDigits = extractDigits(operandA);
  const bDigits = extractDigits(operandB);
  const ansDigits = showAnswer ? extractDigits(answer) : { h: '?', t: '?', o: '?' };

  const columns = ['h', 't', 'o'];
  const labels = { h: 'H', t: 'T', o: 'O' };

  return (
    <div 
      className="column-layout-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '16px 0',
        position: 'relative'
      }}
    >
      {/* Table grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 64px)',
        gap: '0px',
        border: '3px solid var(--color-simulate)',
        borderRadius: '16px',
        backgroundColor: 'rgba(13, 11, 38, 0.95)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Column Headers */}
        {columns.map((col) => {
          const isHighlighted = highlightCol === col;
          return (
            <div
              key={col}
              style={{
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: isHighlighted ? 'var(--color-gold)' : '#94a3b8',
                backgroundColor: isHighlighted ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.08)',
                borderRight: col !== 'o' ? '1.5px solid rgba(255, 255, 255, 0.08)' : 'none',
                fontFamily: "'Fredoka One', Nunito, sans-serif"
              }}
            >
              {labels[col]}
            </div>
          );
        })}

        {/* Subtraction Borrow Indicator Row */}
        {mode === 'sub' && (
          <>
            {columns.map((col) => {
              const isBorrowed = borrowedFrom[col];
              const isGained = borrowedTo[col];
              return (
                <div
                  key={`borrow-${col}`}
                  style={{
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRight: col !== 'o' ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                    color: '#ef4444'
                  }}
                >
                  {isBorrowed && <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{col === 'h' ? aDigits.h : aDigits.t}</span>}
                  {isGained && <span style={{ marginLeft: '4px', color: '#10b981' }}>+10</span>}
                </div>
              );
            })}
          </>
        )}

        {/* Addition Carry Box Row */}
        {mode === 'add' && (
          <>
            {columns.map((col) => {
              const hasCarry = carryDigits[col] > 0;
              return (
                <div
                  key={`carry-cell-${col}`}
                  style={{
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRight: col !== 'o' ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                    position: 'relative'
                  }}
                >
                  {hasCarry && (
                    <span style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      boxShadow: '0 0 6px rgba(16, 185, 129, 0.25)'
                    }}>
                      1
                    </span>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Operand A Row */}
        {columns.map((col) => {
          const isBorrowed = mode === 'sub' && borrowedFrom[col];
          return (
            <div
              key={`opA-${col}`}
              style={{
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '700',
                color: isBorrowed ? '#64748b' : '#ffffff',
                textDecoration: isBorrowed ? 'line-through' : 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                borderRight: col !== 'o' ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                fontFamily: 'Courier New, monospace',
                position: 'relative',
                opacity: isBorrowed ? 0.6 : 1
              }}
            >
              {aDigits[col]}
            </div>
          );
        })}

        {/* Operand B Row */}
        {columns.map((col) => {
          return (
            <div
              key={`opB-${col}`}
              style={{
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '700',
                color: '#ffffff',
                borderBottom: '4px double var(--color-simulate)',
                borderRight: col !== 'o' ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                fontFamily: 'Courier New, monospace',
                position: 'relative'
              }}
            >
              {col === 'h' && (
                <div style={{
                  position: 'absolute',
                  left: '-40px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'var(--color-simulate)',
                  fontFamily: "'Nunito', sans-serif"
                }}>
                  {mode === 'add' ? '+' : '–'}
                </div>
              )}
              {bDigits[col]}
            </div>
          );
        })}

        {/* Answer Row */}
        {columns.map((col) => {
          const isInput = missingDigits[col] && onDigitInput !== null;
          return (
            <div
              key={`ans-${col}`}
              style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: col !== 'o' ? '1.5px solid rgba(255, 255, 255, 0.06)' : 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              {isInput ? (
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={1}
                  value={userDigits[col] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (onDigitInput) onDigitInput(col, val);
                  }}
                  style={{
                    width: '44px',
                    height: '44px',
                    fontSize: '26px',
                    fontWeight: '700',
                    textAlign: 'center',
                    border: '1.5px dashed rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    color: '#ffffff',
                    fontFamily: 'Courier New, monospace',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                  aria-label={`Answer ${col === 'h' ? 'hundreds' : col === 't' ? 'tens' : 'ones'} digit`}
                />
              ) : (
                <span style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: showAnswer ? '#10b981' : 'var(--color-gold)',
                  fontFamily: 'Courier New, monospace',
                  textShadow: showAnswer ? '0 0 10px rgba(16,185,129,0.3)' : '0 0 10px rgba(254,240,138,0.2)'
                }}>
                  {showAnswer ? ansDigits[col] : (userDigits[col] || '?')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
